import * as dotenv from 'dotenv';
import fs from 'node:fs';
import fetch from 'node-fetch';
import { convert, type ConvertResult } from 'openapi-to-postmanv2';

dotenv.config();

export async function updatePostmanCollection() {
  const SWAGGER_FILE = './swagger.json';
  const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
  const COLLECTION_UID = process.env.POSTMAN_COLLECTION_UID;

  if (!POSTMAN_API_KEY || !COLLECTION_UID) {
    throw new Error('POSTMAN_API_KEY ou POSTMAN_COLLECTION_UID manquant');
  }

  if (!fs.existsSync(SWAGGER_FILE)) {
    throw new Error('swagger.json introuvable. Générez-le d\'abord.');
  }

  const swaggerData = fs.readFileSync(SWAGGER_FILE, 'utf-8');

  return new Promise((resolve, reject) => {
    convert(
      { type: 'string', data: swaggerData },
      {
        requestParametersResolution: 'Example',
        exampleParametersResolution: 'Example',
        includeAuthInfoInExample: true,
        folderStrategy: 'Tags',
      },
      async (err: Error | null, result: ConvertResult | null) => {
        if (err) return reject(err);
        if (!result) {
          return reject(new Error('Conversion échouée: résultat invalide'));
        }
        
        if ('output' in result && Array.isArray(result.output) && result.output.length > 0) {
          const resultWithOutput = result as unknown as { output: ReadonlyArray<{ data: unknown }> };
          const collection = resultWithOutput.output[0].data;

          const response = await fetch(
            `https://api.getpostman.com/collections/${COLLECTION_UID}`,
            {
              method: 'PUT',
              headers: {
                'X-Api-Key': POSTMAN_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ collection }),
            },
          );

          if (!response.ok) {
            const errorText = await response.text();
            return reject(new Error(`Erreur Postman API: ${errorText}`));
          }

          console.log('✅ Postman collection mise à jour automatiquement');
          resolve(true);
        } else {
          reject(new Error('Conversion échouée: format de résultat inattendu'));
        }
      },
    );
  });
}

// Si exécuté directement
if (require.main === module) {
  updatePostmanCollection()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erreur:', err);
      process.exit(1);
    });
}
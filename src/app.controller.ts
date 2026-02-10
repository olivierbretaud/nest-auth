import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Test de l'api")
@Controller()
export class AppController {
	@Get("hello")
	@ApiOperation({ summary: "Test de l'api" })
	getHello(): string {
		return "Hello World!";
	}
}

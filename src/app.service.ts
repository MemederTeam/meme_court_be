import { Injectable, Logger} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  @Cron('*/13 * * * *', { timeZone: 'Asia/Seoul' })
  async selfPing() {
    const serverUrl = this.configService.get('SERVER_URL') || 'http://localhost:3000';

    try {
      const response = await fetch(serverUrl);
      this.logger.log(`✅ Self-ping: ${response.status} ${response.statusText}`);
    } catch (error) {
      this.logger.warn(`❌ Self-ping failed: ${error.message}`);
    }
  }
}

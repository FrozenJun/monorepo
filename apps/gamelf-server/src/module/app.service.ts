import { Injectable } from '@nestjs/common'
import { roleDb } from 'src/db/role.db'
import { successResponse } from 'src/response'

@Injectable()
export class AppService {
  async get() {
    const result = await roleDb.get()
    return successResponse(result)
  }
}

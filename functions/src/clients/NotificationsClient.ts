import axios, { AxiosInstance, HttpStatusCode } from "axios"
import { notificacoesApiUrl } from "../config/params"

class NotificationsClient {
  private axiosInstance: AxiosInstance | null = null
  private baseUrl: string

  constructor() {
    this.baseUrl = notificacoesApiUrl.value()
  }

  private getClient(): AxiosInstance {
    if (this.axiosInstance) return this.axiosInstance

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers,
      timeout: 8000,
      validateStatus: () => true,
    })

    return this.axiosInstance
  }

  async markAsRead(login: string, id: string) {
    const client = this.getClient()
    const path = `/notifications/${encodeURIComponent(
      login
    )}/${encodeURIComponent(id)}/read`

    try {
      const resp = await client.patch(path)

      if (
        resp.status !== HttpStatusCode.Ok &&
        resp.status !== HttpStatusCode.Created &&
        resp.status !== HttpStatusCode.NoContent
      ) {
        const body =
          typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data)
        const err = new Error(
          `Failed to mark as read (${resp.status}): ${body}`
        )
        throw err
      }

      return resp.data
    } catch (err: any) {
      throw err
    }
  }

  async markDelete(login: string, id: string) {
    const client = this.getClient()
    const path = `/notifications/${encodeURIComponent(
      login
    )}/${encodeURIComponent(id)}/excluded`

    try {
      const resp = await client.delete(path)

      if (
        resp.status !== HttpStatusCode.Ok &&
        resp.status !== HttpStatusCode.Created &&
        resp.status !== HttpStatusCode.NoContent
      ) {
        const body =
          typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data)
        const err = new Error(
          `Failed to mark as deleted (${resp.status}): ${body}`
        )
        throw err
      }

      return resp.data
    } catch (err: any) {
      throw err
    }
  }
}

export default NotificationsClient

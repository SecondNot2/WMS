import type { Server as HttpServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { logger } from './logger'
import { verifyAccessToken } from './jwt'

interface AuthenticatedSocket extends WebSocket {
  userId?: string
  userRole?: string
  isAlive?: boolean
}

interface WsEvent<T = unknown> {
  event: string
  payload: T
  ts: string
}

let wss: WebSocketServer | null = null

export function attachWebSocketServer(httpServer: HttpServer) {
  if (wss) return wss

  wss = new WebSocketServer({ noServer: true })

  httpServer.on('upgrade', (req, socket, head) => {
    if (!req.url?.startsWith('/ws')) {
      socket.destroy()
      return
    }

    // Extract token từ query string ?token=...
    let token: string | null = null
    try {
      const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`)
      token = url.searchParams.get('token')
    } catch {
      socket.destroy()
      return
    }

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    let payload
    try {
      payload = verifyAccessToken(token)
    } catch {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    wss!.handleUpgrade(req, socket, head, (ws) => {
      const authed = ws as AuthenticatedSocket
      authed.userId = payload.sub
      authed.userRole = payload.role
      authed.isAlive = true
      wss!.emit('connection', authed, req)
    })
  })

  wss.on('connection', (rawSocket) => {
    const socket = rawSocket as AuthenticatedSocket
    logger.info(`[ws] connected user=${socket.userId}`)

    socket.on('pong', () => {
      socket.isAlive = true
    })

    socket.on('message', (raw) => {
      // Hiện tại chỉ broadcast 1 chiều — bỏ qua incoming message ngoài 'ping'
      try {
        const msg = JSON.parse(raw.toString()) as { event?: string }
        if (msg.event === 'ping') {
          socket.send(
            JSON.stringify({
              event: 'pong',
              payload: null,
              ts: new Date().toISOString(),
            }),
          )
        }
      } catch {
        // ignore
      }
    })

    socket.on('close', () => {
      logger.info(`[ws] disconnected user=${socket.userId}`)
    })

    socket.send(
      JSON.stringify({
        event: 'connected',
        payload: { userId: socket.userId },
        ts: new Date().toISOString(),
      }),
    )
  })

  // Heartbeat ping mỗi 30s, drop client không phản hồi
  const heartbeat = setInterval(() => {
    wss?.clients.forEach((client) => {
      const authed = client as AuthenticatedSocket
      if (authed.isAlive === false) return authed.terminate()
      authed.isAlive = false
      try {
        authed.ping()
      } catch {
        // ignore
      }
    })
  }, 30000)

  wss.on('close', () => clearInterval(heartbeat))

  return wss
}

function broadcast<T>(event: string, payload: T) {
  if (!wss) return
  const message: WsEvent<T> = {
    event,
    payload,
    ts: new Date().toISOString(),
  }
  const raw = JSON.stringify(message)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(raw)
      } catch (err) {
        logger.warn(`[ws] send failed: ${(err as Error).message}`)
      }
    }
  })
}

// ─────────────────────────────────────────
// Public emit helpers
// ─────────────────────────────────────────

export function emitStockUpdated(productIds: string[]) {
  if (productIds.length === 0) return
  broadcast('stock:updated', { productIds })
}

export interface InboundEventPayload {
  id: string
  code: string
  status?: string
  approvedById?: string | null
  rejectedReason?: string | null
}

export function emitInboundApproved(payload: InboundEventPayload) {
  broadcast('inbound:approved', payload)
}

export function emitInboundRejected(payload: InboundEventPayload) {
  broadcast('inbound:rejected', payload)
}

export function emitInboundCreated(payload: InboundEventPayload) {
  broadcast('inbound:created', payload)
}

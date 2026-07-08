# Day 11 - Client-Server Model & Communication Protocols

## Table of Contents
- [Introduction](#introduction)
- [What is Client-Server Model?](#what-is-client-server-model)
- [How It Works](#how-it-works)
- [Communication Protocols](#communication-protocols)
  - [HTTP/HTTPS](#httphttps)
  - [WebSockets](#websockets)
  - [gRPC](#grpc)
  - [TCP vs UDP](#tcp-vs-udp)
- [REST vs gRPC vs GraphQL](#rest-vs-grpc-vs-graphql)
- [Real-World Examples](#real-world-examples)
- [Interview Questions](#interview-questions)
- [Summary](#summary)

---

## Introduction

```
Client   ---->   Server
Browser          Backend
Mobile App       API
```

Foundation of almost every system design.

---

## What is Client-Server Model?

Clients request data/services; servers process and respond.

```
Client Sends Request
      |
Server Processes
      |
Server Sends Response
```

---

## How It Works

```
Client
  |
DNS Lookup
  |
TCP Connection
  |
Request Sent
  |
Server Processes
  |
Response Returned
  |
Connection Closed / Kept Alive
```

---

## Communication Protocols

```
HTTP / HTTPS
WebSockets
gRPC
TCP
UDP
```

### HTTP/HTTPS

```
Request-Response Model
Stateless
Text/Binary Based
```

HTTPS = HTTP + TLS Encryption.

### WebSockets

```
Full Duplex
Persistent Connection
Real-Time Communication
```

```
Client <----> Server
   Continuous Two-Way Messages
```

Used in: chat apps, live notifications, trading platforms.

### gRPC

```
Built on HTTP/2
Uses Protocol Buffers
Binary, Fast, Strongly Typed
```

```
Client Stub  --->  Network  --->  Server Stub
```

Used for microservice-to-microservice communication.

### TCP vs UDP

```
TCP  → Reliable, Ordered, Connection-Based
UDP  → Fast, No Guarantee, Connectionless
```

```
TCP Use Case  → File Transfer, Web, Email
UDP Use Case  → Video Streaming, Gaming, VoIP
```

---

## REST vs gRPC vs GraphQL

```
REST     → Simple, Resource-Based, JSON over HTTP
gRPC     → Fast, Binary, Best for Internal Microservices
GraphQL  → Client Decides Exact Data Needed, One Endpoint
```

---

## Real-World Examples

```
Slack     → WebSockets for real-time messages
Google    → gRPC between internal services
Netflix   → REST + gRPC hybrid
YouTube   → UDP-based streaming protocols
```

---

## Interview Questions

**Why is HTTP called stateless?**
Each request is independent; the server doesn't retain memory of previous requests unless explicitly maintained (cookies, sessions, tokens).

**When would you choose WebSockets over HTTP polling?**
When you need real-time, low-latency, bidirectional communication like chat or live updates, instead of repeatedly polling the server.

**Why is gRPC faster than REST?**
It uses HTTP/2 with binary Protocol Buffers instead of text-based JSON, reducing payload size and enabling multiplexed streams.

---

## Summary

- Client-server model is the base of networked applications.
- HTTP is stateless and request-response based.
- WebSockets enable real-time two-way communication.
- gRPC is fast and ideal for internal microservice communication.
- TCP is reliable; UDP is fast but unreliable.

---

**Next:** Blob Storage & S3
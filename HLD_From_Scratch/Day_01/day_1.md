# Day 01 — Learning How to Think About Systems

## Overview

Before learning databases, caching, load balancing, microservices, distributed systems, design patterns, or cloud infrastructure, there is one fundamental skill every system designer must develop:

> The ability to think in systems.

Most beginners start by learning technologies.

Experienced engineers start by understanding the problem, identifying responsibilities, defining boundaries, and then selecting technologies to solve those problems.

System Design is not primarily about tools.

System Design is about making architectural decisions that allow software systems to be:

- Scalable
- Reliable
- Maintainable
- Available
- Fault Tolerant
- Cost Effective

This chapter focuses on developing the mindset required to design real-world systems.

---

# What is a System?

A system is a collection of independent components working together to achieve a common objective.

Consider a modern application such as Instagram.

Although users see a single application, internally it consists of many independent services.

```text
Instagram
│
├── User Service
├── Post Service
├── Feed Service
├── Notification Service
├── Search Service
├── Media Service
└── Analytics Service
```

Each service is responsible for a specific domain of the application.

Together they create the complete product experience.

---

# The First Principle of System Design

Whenever a problem is presented, do not immediately think about:

- MySQL
- Redis
- Kafka
- Kubernetes
- AWS

Instead ask:

> What responsibilities must the system fulfill?

Technology choices come later.

Responsibilities come first.

---

## Example

Suppose we are designing a Food Delivery Platform.

A beginner often thinks:

```text
Use MySQL
Use Redis
Use Docker
Use Kafka
```

An experienced engineer first identifies responsibilities:

```text
User Management

Restaurant Management

Order Management

Payment Processing

Delivery Tracking

Notification Management
```

Once responsibilities are clear, technologies can be selected appropriately.

---

# Two Ways to Approach System Design

There are two common approaches to understanding and designing systems.

---

# 1. Top-Down Approach

The Top-Down approach begins with the overall system and gradually moves into implementation details.

This is the most commonly used approach during architecture discussions and system design interviews.

---

## Process

### Step 1: Understand the Problem

Before designing anything, understand:

- Who are the users?
- What problem are we solving?
- What are the requirements?
- What are the constraints?

Example:

Design YouTube.

Requirements:

- Upload videos
- Watch videos
- Search videos
- Recommend videos
- Like and comment on videos

---

### Step 2: Identify Major Components

Break the system into logical services.

```text
YouTube

├── User Service
├── Video Service
├── Search Service
├── Recommendation Service
├── Comment Service
└── Notification Service
```

At this stage we focus only on responsibilities.

Not implementation.

---

### Step 3: Define Interactions

Understand how components communicate.

```text
User Uploads Video
        │
        ▼
Video Service
        │
        ▼
Storage Service
        │
        ▼
Processing Service
        │
        ▼
Search Service
```

Understanding data flow is critical.

---

### Step 4: Dive Into Individual Components

Once architecture is clear, move deeper.

Example:

Video Service

```text
Video Service

├── Upload API
├── Video Metadata Database
├── Storage Layer
├── Processing Pipeline
└── CDN Integration
```

Now we start discussing technical implementation.

---

## Top-Down Visualization

```text
Entire System
      │
      ▼
Major Components
      │
      ▼
Component Responsibilities
      │
      ▼
Technical Design
      │
      ▼
Implementation Details
```

---

## When to Use Top-Down

Use this approach when:

- Designing a new system
- Creating High-Level Design (HLD)
- Understanding architecture
- Discussing system requirements

---

# 2. Bottom-Up Approach

The Bottom-Up approach starts from individual building blocks and gradually combines them into larger systems.

Instead of starting with architecture, we start with technical components.

---

## Process

Example:

We already understand:

```text
Database
Cache
Load Balancer
Message Queue
API Server
```

We combine them to build a service.

```text
Database
     +
Cache
     +
Load Balancer
     +
API Server

     =
User Service
```

Multiple services then create the complete system.

```text
User Service
+
Post Service
+
Search Service
+
Notification Service

=
Complete Product
```

---

## When to Use Bottom-Up

Useful for:

- Learning infrastructure
- Understanding implementation details
- Improving existing systems
- Low-Level Design discussions

---

# Which Approach Should Be Used?

In real engineering environments, both approaches are used together.

A common workflow looks like:

```text
Top Down

System
   ↓
Components
   ↓
Responsibilities

Bottom Up

Databases
Caches
Load Balancers
Infrastructure
```

Think globally first.

Think technically second.

---

# How Real Systems Are Designed

A common beginner mistake is designing applications as one large component.

Real-world systems do not work this way.

Large systems are divided into independent services.

---

# Rule 1: Divide the System into Components

Every large application should be decomposed into smaller parts.

Example:

```text
E-Commerce Platform

├── User Service
├── Product Service
├── Inventory Service
├── Cart Service
├── Order Service
├── Payment Service
└── Notification Service
```

Benefits:

- Easier maintenance
- Easier scaling
- Easier testing
- Easier deployment
- Better fault isolation

---

# Rule 2: Every Component Must Own a Responsibility

Each component should be responsible for a specific domain.

Bad Design:

```text
User Service

- Authentication
- Payments
- Search
- Orders
- Notifications
```

Everything is mixed together.

This creates tight coupling and complexity.

---

Good Design:

```text
User Service
    → Authentication

Order Service
    → Orders

Payment Service
    → Payments

Notification Service
    → Notifications
```

Each service owns a clear responsibility.

This concept is often called:

> Separation of Concerns

---

# Rule 3: Design the Internal Technical Details

After identifying components, define how they will work internally.

Questions to ask:

### Storage

```text
SQL or NoSQL?
```

### Caching

```text
Redis?
Local Cache?
```

### Communication

```text
REST?
gRPC?
Message Queue?
```

### Scalability

```text
Horizontal Scaling?
Vertical Scaling?
```

### Availability

```text
Replication?
Failover?
```

Every service requires its own technical design.

---

## Example

User Service

```text
Database:
PostgreSQL

Cache:
Redis

Authentication:
JWT

Communication:
REST APIs

Scaling:
Horizontal Scaling
```

Now the component has an implementation strategy.

---

# Rule 4: Every Component Must Be Independently Scalable

Different components experience different traffic patterns.

Example:

```text
User Service

1,000 requests/sec
```

```text
Video Service

50,000 requests/sec
```

Scaling the entire system would be wasteful.

Instead:

```text
Scale Only The Video Service
```

Modern architectures scale services independently.

---

# Rule 5: Every Component Must Be Fault Tolerant

Failures are inevitable.

Servers fail.

Networks fail.

Databases fail.

A good system assumes failure will happen.

---

## Example

```text
Primary Database
        │
        ▼
Fails
        │
        ▼
Replica Database Takes Over
```

The service remains operational.

This is fault tolerance.

---

# Rule 6: Every Component Must Be Highly Available

Availability means the service remains accessible even during failures.

Example:

```text
             Load Balancer
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼

 Server A      Server B      Server C
```

If one server crashes:

```text
Server A ❌

Traffic automatically moves to:

Server B
Server C
```

Users continue using the application without disruption.

---

# Putting Everything Together

Suppose we are designing a Video Streaming Platform.

---

## Step 1: Requirements

Users should be able to:

- Upload videos
- Watch videos
- Search videos
- Like videos
- Comment on videos

---

## Step 2: Identify Components

```text
Video Platform

├── User Service
├── Video Service
├── Search Service
├── Comment Service
├── Recommendation Service
└── Notification Service
```

---

## Step 3: Assign Responsibilities

```text
User Service
    → Authentication

Video Service
    → Video Upload & Streaming

Search Service
    → Search Functionality

Comment Service
    → User Comments

Recommendation Service
    → Suggested Content
```

---

## Step 4: Design Internals

Video Service

```text
Database:
PostgreSQL

Cache:
Redis

Storage:
Object Storage

Load Balancer:
NGINX

CDN:
CloudFront
```

---

## Step 5: Ensure Scalability

```text
Load Balancer
       │
       ▼

Video Instance 1

Video Instance 2

Video Instance 3
```

Traffic is distributed across multiple instances.

---

## Step 6: Ensure Reliability

```text
Primary Database
        │
        ▼
Read Replica
```

If the primary fails, backup systems continue serving requests.

---

# Key Takeaways

1. System Design starts with understanding responsibilities, not technologies.

2. Use the Top-Down approach to understand the overall architecture.

3. Use the Bottom-Up approach to understand implementation details.

4. Divide large systems into smaller independent components.

5. Give every component a clear and isolated responsibility.

6. Design internal technical details separately for every component.

7. Ensure every component is independently scalable.

8. Ensure every component is fault tolerant.

9. Ensure every component is highly available.

10. Good system design is the art of managing complexity through decomposition, responsibility ownership, and architectural thinking.

---

# Next Steps

In the next chapter, we will start exploring the foundational building blocks used inside modern systems:

- Servers
- Clients
- Databases
- APIs
- Networks
- Communication Protocols

These components form the backbone of every software system we design.
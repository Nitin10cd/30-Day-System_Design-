# 30-Day System Design Journey

A structured and practical repository for learning **System Design from Scratch**, covering both **Low-Level Design (LLD)** and **High-Level Design (HLD)**.

This repository documents concepts, design principles, architecture patterns, real-world examples, and implementation approaches required to build scalable and maintainable software systems.

---

# Table of Contents

- Introduction
- What is System Design?
- Why Learn System Design?
- Real-World Use Cases
- Types of System Design
  - High-Level Design (HLD)
  - Low-Level Design (LLD)
- Learning Roadmap
- Topics Covered
- Recommended Prerequisites
- How to Use This Repository
- Resources
- Goals

---

# Introduction

Modern software systems serve millions of users, process massive amounts of data, and require high availability, scalability, and reliability.

System Design is the discipline of designing software architectures that can efficiently handle these requirements.

This repository is a personal learning journey focused on understanding:

- How large-scale systems are built
- How software components communicate
- How databases are designed
- How scalability challenges are solved
- How maintainable object-oriented systems are created

---

# What is System Design?

System Design is the process of defining the architecture, components, modules, interfaces, and data flow of a software system.

It answers questions such as:

- How should the system be structured?
- How will components communicate?
- How will data be stored?
- How can the system scale?
- How can failures be handled?
- How can performance be optimized?

System Design combines:

- Software Engineering
- Architecture
- Networking
- Databases
- Distributed Systems
- Object-Oriented Design

to create robust and efficient applications.

---

# Why Learn System Design?

System Design is essential for software engineers because writing code alone is not enough when building production-grade applications.

Benefits include:

### Scalability

Design systems that can handle increasing traffic and data.

### Reliability

Ensure systems remain available even during failures.

### Maintainability

Create architectures that are easier to update and extend.

### Performance

Optimize latency, throughput, and resource utilization.

### Interview Preparation

System Design is a critical component of interviews at top technology companies.

### Real-World Engineering

Understand how products like:

- YouTube
- Netflix
- Uber
- WhatsApp
- Instagram
- Amazon

are architected and scaled.

---

# Real-World Use Cases

System Design concepts are used in:

### Social Media Platforms

- Instagram
- LinkedIn
- Twitter
- Facebook

### E-Commerce Platforms

- Amazon
- Flipkart
- Shopify

### Streaming Services

- Netflix
- YouTube
- Spotify

### Messaging Applications

- WhatsApp
- Telegram
- Discord

### Ride Sharing Platforms

- Uber
- Ola
- Lyft

### Cloud Infrastructure

- AWS
- Azure
- Google Cloud

---

# Types of System Design

System Design is generally divided into two major categories:

---

# High-Level Design (HLD)

High-Level Design focuses on the overall architecture of the system.

It defines:

- System components
- Services
- Data flow
- Communication between modules
- Scalability strategies

### Questions Answered by HLD

- How many services are required?
- Which database should be used?
- How will caching work?
- How will requests flow through the system?
- How will the system scale?

### Example Topics

- Load Balancers
- Reverse Proxies
- Caching
- Databases
- Message Queues
- Distributed Systems
- Microservices
- API Gateways
- CAP Theorem
- Consistency Models

---

# Low-Level Design (LLD)

Low-Level Design focuses on the internal implementation of software components.

It defines:

- Classes
- Objects
- Interfaces
- Relationships
- Design Patterns

### Questions Answered by LLD

- What classes are required?
- How should objects interact?
- Which design pattern should be used?
- How should responsibilities be distributed?

### Example Topics

- Object-Oriented Design
- SOLID Principles
- Design Patterns
- UML Diagrams
- Class Design
- Interface Design
- Dependency Injection

---

# Learning Roadmap

## Phase 1: Foundations

- Computer Networks Basics
- Operating Systems Basics
- Database Fundamentals
- OOP Concepts

## Phase 2: Low-Level Design

- SOLID Principles
- Design Patterns
- UML Diagrams
- Object Modeling
- Code Structuring

## Phase 3: High-Level Design

- Scalability Concepts
- Database Design
- Caching
- Load Balancing
- Message Queues
- Distributed Systems

## Phase 4: System Design Case Studies

Designing systems such as:

- URL Shortener
- Chat Application
- Video Streaming Service
- Social Media Feed
- Online Code Editor
- Notification System
- Ride Sharing Platform
- E-Commerce Platform

---

# Topics Covered

## Low-Level Design

### Object-Oriented Programming

- Encapsulation
- Abstraction
- Inheritance
- Polymorphism

### SOLID Principles

- Single Responsibility Principle
- Open Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

### Design Patterns

#### Creational Patterns

- Singleton
- Factory Method
- Abstract Factory
- Builder
- Prototype

#### Structural Patterns

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Proxy

#### Behavioral Patterns

- Observer
- Strategy
- Command
- State
- Chain of Responsibility
- Mediator

### UML

- Class Diagrams
- Sequence Diagrams
- Use Case Diagrams

---

## High-Level Design

### Architecture Fundamentals

- Monolithic Architecture
- Microservices Architecture
- Event Driven Architecture

### Databases

- SQL Databases
- NoSQL Databases
- Database Sharding
- Replication
- Partitioning

### Scalability

- Horizontal Scaling
- Vertical Scaling

### Caching

- Redis
- Cache Aside Pattern
- Write Through Cache

### Load Balancing

- Round Robin
- Least Connections
- Consistent Hashing

### Distributed Systems

- CAP Theorem
- Consensus Algorithms
- Distributed Locks

### Messaging Systems

- Kafka
- RabbitMQ
- Event Streaming

### Reliability

- Fault Tolerance
- Circuit Breakers
- Retry Mechanisms

### Security

- Authentication
- Authorization
- JWT
- OAuth

---

# Repository Structure

```text
30-Day-System_Design/
│
├── HLD_From_Scratch/
│   ├── Day-01/
│   ├── Day-02/
│   ├── ...
│
├── LLD_From_Scratch/
│   ├── Day-01/
│   ├── Day-02/
│   ├── ...
│
└── README.md
```

---

# Recommended Prerequisites

Before diving deep into System Design, it is recommended to have basic knowledge of:

- Programming Fundamentals
- Data Structures and Algorithms
- Object-Oriented Programming
- Databases
- Networking Basics
- Operating Systems

---

# How to Use This Repository

1. Follow the learning sequence day by day.
2. Study theoretical concepts.
3. Analyze architecture diagrams.
4. Implement design examples when possible.
5. Review real-world case studies.
6. Document learnings and observations.

The goal is not only to understand concepts but also to develop the ability to design systems independently.

---

# Goals

By the end of this journey, the objective is to:

- Understand software architecture fundamentals
- Design scalable systems
- Apply object-oriented design principles
- Understand distributed systems concepts
- Build confidence in system design interviews
- Analyze and architect real-world applications

---

# Disclaimer

This repository is intended for educational purposes and personal learning. The content is continuously updated as new concepts, patterns, and architectural approaches are explored.

---

# License

This repository is open for learning, reference, and educational use.
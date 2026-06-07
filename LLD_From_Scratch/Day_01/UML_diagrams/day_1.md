# Day 01 - UML Diagrams and Relationships

## Introduction

Before writing code, software engineers need a way to visualize and communicate software designs.

As systems become larger, understanding architecture solely through source code becomes difficult. Teams need a common language to discuss classes, object interactions, dependencies, and overall system structure.

This is where UML becomes important.

UML helps engineers model software before implementation, making systems easier to understand, design, document, and maintain.

Think of UML as the blueprint of software engineering.

Just as architects create blueprints before constructing buildings, software engineers create UML diagrams before building software systems.

---

# What is UML?

UML stands for:

**Unified Modeling Language**

It is a standardized visual language used to model, design, document, and communicate software systems.

UML is not a programming language.

It is a visual representation of software concepts and relationships.

It helps developers describe:

- System structure
- Class relationships
- Object interactions
- Workflows
- Communication between components

---

# Why UML?

Imagine joining a project containing:

```text
500+ Classes
100+ APIs
20+ Services
Multiple Teams
```

Understanding everything directly from code would be difficult.

UML helps by providing:

- Better communication
- Better documentation
- Easier maintenance
- Better design discussions
- Early identification of design issues
- Clear visualization of system architecture

---

# UML Diagram Categories

UML diagrams are divided into two major categories.

```text
UML Diagrams
│
├── Structural Diagrams
│
└── Behavioral Diagrams
```

---

# Structural Diagrams

Structural diagrams focus on:

> What the system is made of.

They describe the static structure of software.

These diagrams represent:

- Classes
- Objects
- Components
- Packages
- Relationships

---

## Types of Structural Diagrams

```text
Structural Diagrams
│
├── Class Diagram
├── Object Diagram
├── Component Diagram
├── Package Diagram
└── Deployment Diagram
```

The most important structural diagram for Low-Level Design is:

### Class Diagram

---

# Behavioral Diagrams

Behavioral diagrams focus on:

> How the system behaves.

They represent interactions, workflows, and communication.

---

## Types of Behavioral Diagrams

```text
Behavioral Diagrams
│
├── Sequence Diagram
├── Activity Diagram
├── Use Case Diagram
├── State Diagram
└── Communication Diagram
```

The most important behavioral diagram for Low-Level Design is:

### Sequence Diagram

---

# Class Diagram

A Class Diagram represents:

- Classes
- Attributes
- Methods
- Relationships

It is the most commonly used UML diagram in Object-Oriented Design.

---

## Structure of a Class

```text
+----------------------+
| Employee             |
+----------------------+
| id : int             |
| name : string        |
| salary : double      |
+----------------------+
| work()               |
| getSalary()          |
+----------------------+
```

---

## Parts of a Class

Every UML class contains three sections.

```text
+----------------------+
| Class Name           |
+----------------------+
| Attributes           |
+----------------------+
| Methods              |
+----------------------+
```

---

## Example

```text
+----------------------+
| Employee             |
+----------------------+
| id : int             |
| name : string        |
| salary : double      |
+----------------------+
| work()               |
| getSalary()          |
+----------------------+
```

---

# Visibility Symbols

UML uses symbols to represent access modifiers.

| Symbol | Meaning |
|----------|----------|
| + | Public |
| - | Private |
| # | Protected |

---

## Example

```text
+----------------------+
| Employee             |
+----------------------+
| - salary             |
| # name               |
+----------------------+
| + getSalary()        |
+----------------------+
```

---

# Sequence Diagram

A Sequence Diagram describes:

> How objects interact over time.

Unlike Class Diagrams, Sequence Diagrams are dynamic.

They focus on:

- Request flow
- Response flow
- Communication
- Order of execution

---

## Login Flow Example

```text
User
 │
 │ Login Request
 ▼

Frontend
 │
 │ Validate Credentials
 ▼

Auth Service
 │
 │ Fetch User
 ▼

Database
 │
 │ Return User Data
 ▼

Auth Service
 │
 │ Generate JWT
 ▼

Frontend
 │
 │ Login Success
 ▼

User
```

---

# UML Relationships

Classes rarely exist independently.

Real-world systems are built using relationships between classes.

Understanding these relationships is one of the most important parts of Low-Level Design.

```text
Relationships
│
├── Association
├── Inheritance
├── Aggregation
├── Composition
└── Dependency
```

---

# 1. Association

Association represents a connection between two independent classes.

It answers:

> Which objects work together?

Association is the most common relationship in software systems.

---

## Example

```text
Student -------- Course
```

A student can enroll in a course.

A course can exist without a particular student.

A student can exist without a particular course.

---

## UML Representation

```text
+-----------+       +-----------+
| Student   |-------| Course    |
+-----------+       +-----------+
```

---

## Real World Examples

```text
Customer -------- Order

Doctor -------- Patient

Teacher -------- Student
```

---

## Characteristics

- Independent lifecycle
- No ownership
- Loose relationship
- Most common UML relationship

---

# 2. Inheritance

Inheritance represents an:

> IS-A Relationship

A child class inherits properties and behavior from a parent class.

---

## Example

```text
Employee
   ▲
   │
SoftwareEngineer
```

Meaning:

```text
SoftwareEngineer IS AN Employee
```

---

## UML Representation

```text
          Employee
              ▲
              │
              │
      SoftwareEngineer
```

The hollow triangle always points toward the parent class.

---

## Real World Example

```text
Vehicle
│
├── Car
├── Bike
└── Truck
```

Every Car is a Vehicle.

Every Bike is a Vehicle.

Every Truck is a Vehicle.

---

## Characteristics

- Code reuse
- Hierarchical relationship
- Parent-child structure
- IS-A relationship

---

# 3. Aggregation

Aggregation represents a:

> HAS-A Relationship

with weak ownership.

The child object can exist independently of the parent.

---

## Example

```text
Department HAS Employees
```

Employees can still exist even if the Department is removed.

---

## UML Representation

```text
Department ◇──────── Employee
```

The hollow diamond represents Aggregation.

---

## Diagram

```text
+--------------+
| Department   |
+--------------+
        ◇
        |
        |
+--------------+
| Employee     |
+--------------+
```

---

## Real World Examples

```text
University ◇ Student

Team ◇ Player

Library ◇ Book
```

The contained object can exist independently.

---

## Characteristics

- Weak ownership
- Independent lifecycle
- Shared objects possible
- Loose coupling

---

# 4. Composition

Composition represents a:

> Strong HAS-A Relationship

The child object cannot exist without the parent.

The parent owns the child completely.

---

## Example

```text
House HAS Rooms
```

If the House is destroyed, the Rooms cease to exist as part of that House.

---

## UML Representation

```text
House ◆──────── Room
```

The filled diamond represents Composition.

---

## Diagram

```text
+-----------+
| House     |
+-----------+
      ◆
      |
      |
+-----------+
| Room      |
+-----------+
```

---

## Real World Examples

```text
Car ◆ Engine

House ◆ Room

Human ◆ Heart
```

The child object's lifecycle depends on the parent.

---

## Characteristics

- Strong ownership
- Dependent lifecycle
- Tight coupling
- Parent controls existence

---

# 5. Dependency

Dependency represents a:

> USES Relationship

One class temporarily uses another class.

There is no ownership.

---

## Example

```text
OrderService -------> PaymentService
```

OrderService uses PaymentService to process payments.

It does not own PaymentService.

---

## UML Representation

```text
OrderService - - - - > PaymentService
```

The dashed arrow represents Dependency.

---

## Real World Examples

```text
OrderService → PaymentService

EmailService → SMTPClient

ReportGenerator → DatabaseConnection
```

---

## Characteristics

- Temporary relationship
- No ownership
- Loose coupling
- Common in service-oriented architectures

---

# Relationship Comparison

| Relationship | Meaning | Ownership | Lifecycle Dependency |
|-------------|----------|------------|----------------------|
| Association | Works With | No | Independent |
| Inheritance | IS-A | Parent-Child | Dependent |
| Aggregation | HAS-A | Weak | Independent |
| Composition | Strong HAS-A | Strong | Dependent |
| Dependency | USES | No | Independent |

---

# Association vs Aggregation vs Composition

| Feature | Association | Aggregation | Composition |
|----------|-------------|------------|------------|
| Ownership | No | Weak | Strong |
| Lifecycle Dependency | No | No | Yes |
| Coupling | Loose | Medium | Tight |
| UML Symbol | Line | Hollow Diamond ◇ | Filled Diamond ◆ |
| Example | Student-Course | Department-Employee | House-Room |

---

# Aggregation vs Composition

| Feature | Aggregation | Composition |
|----------|------------|------------|
| Ownership | Weak | Strong |
| Lifecycle | Independent | Dependent |
| UML Symbol | ◇ | ◆ |
| Child Survival | Yes | No |
| Example | Team-Player | Car-Engine |

---

# Class Diagram vs Sequence Diagram

| Class Diagram | Sequence Diagram |
|--------------|------------------|
| Static View | Dynamic View |
| Structure | Behavior |
| Classes | Interactions |
| Relationships | Request Flow |
| Blueprint | Runtime Execution |

---

# Summary

In this chapter we learned:

## Structural UML

- Class Diagram
- Class Structure
- Visibility Symbols

## Behavioral UML

- Sequence Diagram

## UML Relationships

- Association
- Inheritance
- Aggregation
- Composition
- Dependency

These concepts form the foundation of Object-Oriented Design and Low-Level Design.

Almost every Design Pattern, SOLID Principle, and production-grade software architecture relies on these UML concepts.

---

# Next Steps

In the next chapter we will study:

- Multiplicity
- Cardinality
- One-to-One Relationships
- One-to-Many Relationships
- Many-to-Many Relationships
- Object Modeling
- Domain Modeling

These concepts will help us design real-world software systems more accurately before implementation.
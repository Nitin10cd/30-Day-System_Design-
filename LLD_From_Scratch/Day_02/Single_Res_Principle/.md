# S — Single Responsibility Principle (SRP)

## Definition

> **"A class should have only one reason to change."**
> — Robert C. Martin (Uncle Bob)

A class or module should do **one thing** and do it well. More precisely, it should have only one *actor* (a person or system) that could demand a change in it.

---

## Why It Matters

When a class handles multiple responsibilities, changes to one concern can unexpectedly break another. This leads to:

- **Fragile code** — touching one feature breaks an unrelated one
- **Poor testability** — you can't unit-test one responsibility without dragging in others
- **Low reusability** — you can't reuse part of a class without carrying its baggage
- **Merge conflicts** — multiple developers editing the same class for different reasons

---

## The "Reason to Change" Mental Model

Ask yourself: **"Who would ask me to change this class?"**

If the answer involves more than one role (e.g., "the DBA *and* the UI designer *and* the HR manager"), the class has too many responsibilities.

---

## Classic Violation Example

```cpp
class Employee {
    string name;
public:
    // HR responsibility
    double calculatePay();

    // Reporting responsibility
    string generateReport();

    // Persistence responsibility
    void saveToDatabase();
};
```

Three different actors own three different responsibilities:
| Method             | Actor who demands change |
|--------------------|--------------------------|
| `calculatePay()`   | HR / Finance team        |
| `generateReport()` | Reporting / Management   |
| `saveToDatabase()` | Database / IT team       |

Any change from any actor touches the same class — coupling unrelated concerns together.

---

## Correct Design

Split responsibilities into separate classes:

```cpp
class Employee { /* pure data */ };
class PayCalculator   { double calculatePay(Employee&); };
class ReportGenerator { string generateReport(Employee&); };
class EmployeeRepo    { void save(Employee&); };
```

Each class now has **exactly one reason to change**.

---

## Real-World Analogies

- A **chef** cooks food; a **waiter** serves it. They don't swap roles mid-service.
- A **compiler** parses code; a **linker** resolves symbols. Neither does the other's job.
- A **logger** logs; a **formatter** formats output. Keep them separate.

---

## Benefits

| Benefit              | Description                                              |
|----------------------|----------------------------------------------------------|
| Easier maintenance   | Changes are localized to one place                       |
| Better testability   | Each class can be unit-tested in isolation               |
| Higher reusability   | Small, focused classes compose well                      |
| Clearer ownership    | Every class has a single owner / team                    |
| Reduced coupling     | Unrelated concerns don't interfere with each other       |

---

## Common Misconceptions

- **"One method per class"** — No. SRP is about *reasons to change*, not method count.
- **"One file per responsibility"** — File layout is a consequence, not the goal.
- **"Always split everything"** — Over-separation creates unnecessary complexity. Apply judgment.

---

## See the Code

Refer to `01_SRP.cpp` for a complete before/after demonstration using an `Invoice` system that separates printing, persistence, and business logic into dedicated classes.
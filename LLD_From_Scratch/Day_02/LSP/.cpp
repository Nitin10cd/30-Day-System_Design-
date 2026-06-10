/**
 * Liskov Substitution Principle (LSP)
 * =====================================
 * "Subtypes must be substitutable for their base types without altering
 *  the correctness of the program."
 *
 * This example models a Bird hierarchy.
 *
 * BAD DESIGN  : Penguin extends Bird which has fly() — Penguin can't fly,
 *               so it throws an exception, violating the base class contract.
 * GOOD DESIGN : Separate interfaces for flying and non-flying birds mean
 *               every subtype fully honors its contract.
 */

#include <iostream>
#include <vector>
#include <memory>
#include <stdexcept>
#include <string>

// ─────────────────────────────────────────────────────────────
// ❌  BAD DESIGN — Penguin breaks the Bird contract
// ─────────────────────────────────────────────────────────────
namespace Bad {

class Bird {
public:
    virtual std::string name() const = 0;
    virtual void makeSound() const = 0;

    // All birds can fly — or can they?
    virtual void fly() const {
        std::cout << name() << " is flying!\n";
    }
    virtual ~Bird() = default;
};

class Sparrow : public Bird {
public:
    std::string name() const override { return "Sparrow"; }
    void makeSound() const override { std::cout << "Sparrow: Tweet!\n"; }
    // fly() inherited — fine
};

class Eagle : public Bird {
public:
    std::string name() const override { return "Eagle"; }
    void makeSound() const override { std::cout << "Eagle: Screech!\n"; }
    // fly() inherited — fine
};

class Penguin : public Bird {
public:
    std::string name() const override { return "Penguin"; }
    void makeSound() const override { std::cout << "Penguin: Squawk!\n"; }

    // ⚠️  Penguin CAN'T fly — violates the base class behavioral contract!
    void fly() const override {
        throw std::logic_error("Penguins cannot fly!");
    }
};

// This function assumes ALL Birds can fly — a reasonable assumption given the type.
// But it CRASHES for Penguin. LSP is broken.
void makeBirdFly(Bird& bird) {
    bird.makeSound();
    bird.fly();   // Explodes if bird is a Penguin!
}

} // namespace Bad


// ─────────────────────────────────────────────────────────────
// ✅  GOOD DESIGN — Honest interface hierarchy
// ─────────────────────────────────────────────────────────────
namespace Good {

// --- Base interface all birds satisfy -------------------------
class Bird {
public:
    virtual std::string name() const = 0;
    virtual void makeSound() const = 0;
    virtual ~Bird() = default;
};

// --- Extended interface only for flying birds -----------------
class FlyingBird : public Bird {
public:
    virtual void fly() const = 0;
};

// --- Concrete flying birds ------------------------------------
class Sparrow : public FlyingBird {
public:
    std::string name() const override { return "Sparrow"; }
    void makeSound() const override { std::cout << "Sparrow: Tweet!\n"; }
    void fly() const override { std::cout << "Sparrow flaps its wings and soars.\n"; }
};

class Eagle : public FlyingBird {
public:
    std::string name() const override { return "Eagle"; }
    void makeSound() const override { std::cout << "Eagle: Screech!\n"; }
    void fly() const override { std::cout << "Eagle glides majestically on thermals.\n"; }
};

// --- Concrete non-flying bird ---------------------------------
class Penguin : public Bird {
public:
    std::string name() const override { return "Penguin"; }
    void makeSound() const override { std::cout << "Penguin: Squawk!\n"; }

    // No fly() — Penguin is honest about what it can do.
    void swim() const { std::cout << "Penguin glides through water at 25 mph.\n"; }
};

// This function only accepts FlyingBirds — the type system enforces correctness.
void makeBirdFly(FlyingBird& bird) {
    bird.makeSound();
    bird.fly();  // SAFE — guaranteed by the type
}

// This function works with ALL birds without making flight assumptions.
void listenToBird(Bird& bird) {
    bird.makeSound();
}

} // namespace Good


// ─────────────────────────────────────────────────────────────
// DEMO
// ─────────────────────────────────────────────────────────────

int main() {
    std::cout << "===== BAD DESIGN =====\n";
    {
        Bad::Sparrow sparrow;
        Bad::Eagle   eagle;
        Bad::Penguin penguin;

        makeBirdFly(sparrow);  // OK
        makeBirdFly(eagle);    // OK

        std::cout << "Trying to make Penguin fly...\n";
        try {
            makeBirdFly(penguin);   // ❌ Throws! LSP violated.
        } catch (const std::logic_error& e) {
            std::cout << "ERROR: " << e.what() << "\n";
        }
    }

    std::cout << "\n===== GOOD DESIGN =====\n";
    {
        Good::Sparrow sparrow;
        Good::Eagle   eagle;
        Good::Penguin penguin;

        std::cout << "-- Flying birds --\n";
        makeBirdFly(sparrow);    // ✅ Safe
        makeBirdFly(eagle);      // ✅ Safe
        // makeBirdFly(penguin); // ✅ Won't even compile — type system prevents it

        std::cout << "\n-- All birds --\n";
        listenToBird(sparrow);
        listenToBird(eagle);
        listenToBird(penguin);   // ✅ Safe — no fly() assumption

        std::cout << "\n-- Penguin-specific behavior --\n";
        penguin.swim();
    }

    return 0;
}
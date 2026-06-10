/**
 * Open/Closed Principle (OCP)
 * ============================
 * "Software entities should be open for extension, closed for modification."
 *
 * This example models an Area Calculator for geometric shapes.
 *
 * BAD DESIGN  : AreaCalculator uses if/else chains — adding a new shape
 *               requires editing the calculator (modification).
 * GOOD DESIGN : An abstract Shape interface lets new shapes be added as new
 *               classes without touching AreaCalculator (extension only).
 */

#include <iostream>
#include <vector>
#include <memory>
#include <cmath>
#include <string>

constexpr double PI = 3.14159265358979;

// ─────────────────────────────────────────────────────────────
// ❌  BAD DESIGN — Adding a new shape means editing the calculator
// ─────────────────────────────────────────────────────────────
namespace Bad {

struct Shape {
    std::string type;
    double a, b;   // dimensions (meaning depends on type)
};

class AreaCalculator {
public:
    // Every new shape type forces us to OPEN and MODIFY this function.
    double totalArea(const std::vector<Shape>& shapes) const {
        double total = 0;
        for (const auto& s : shapes) {
            if (s.type == "Circle")
                total += PI * s.a * s.a;
            else if (s.type == "Rectangle")
                total += s.a * s.b;
            else if (s.type == "Triangle")
                total += 0.5 * s.a * s.b;
            // Adding "Pentagon" → MUST EDIT THIS CLASS  ← violation
        }
        return total;
    }
};

} // namespace Bad


// ─────────────────────────────────────────────────────────────
// ✅  GOOD DESIGN — Extend via new classes; AreaCalculator never changes
// ─────────────────────────────────────────────────────────────
namespace Good {

// --- Abstraction (the "closed" contract) ----------------------
struct Shape {
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() = default;
};

// --- Concrete shapes (the "open for extension" part) ----------

class Circle : public Shape {
    double radius;
public:
    explicit Circle(double r) : radius(r) {}
    double area() const override { return PI * radius * radius; }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    std::string name() const override { return "Rectangle"; }
};

class Triangle : public Shape {
    double base, height;
public:
    Triangle(double b, double h) : base(b), height(h) {}
    double area() const override { return 0.5 * base * height; }
    std::string name() const override { return "Triangle"; }
};

// NEW SHAPE added without touching any existing code ──────────
class RegularHexagon : public Shape {
    double side;
public:
    explicit RegularHexagon(double s) : side(s) {}
    double area() const override { return (3.0 * std::sqrt(3.0) / 2.0) * side * side; }
    std::string name() const override { return "Hexagon"; }
};

// --- Calculator is CLOSED for modification --------------------
class AreaCalculator {
public:
    double totalArea(const std::vector<std::unique_ptr<Shape>>& shapes) const {
        double total = 0;
        for (const auto& s : shapes)
            total += s->area();
        return total;
    }

    void printBreakdown(const std::vector<std::unique_ptr<Shape>>& shapes) const {
        for (const auto& s : shapes)
            std::cout << s->name() << " : " << s->area() << "\n";
        std::cout << "Total area : " << totalArea(shapes) << "\n";
    }
};

} // namespace Good


// ─────────────────────────────────────────────────────────────
// DEMO
// ─────────────────────────────────────────────────────────────

int main() {
    std::cout << "===== BAD DESIGN =====\n";
    {
        Bad::AreaCalculator calc;
        std::vector<Bad::Shape> shapes = {
            {"Circle",    5.0, 0.0},
            {"Rectangle", 4.0, 6.0},
            {"Triangle",  3.0, 8.0},
        };
        std::cout << "Total area: " << calc.totalArea(shapes) << "\n";
        std::cout << "(Adding Pentagon would require modifying AreaCalculator)\n";
    }

    std::cout << "\n===== GOOD DESIGN =====\n";
    {
        Good::AreaCalculator calc;

        std::vector<std::unique_ptr<Good::Shape>> shapes;
        shapes.push_back(std::make_unique<Good::Circle>(5.0));
        shapes.push_back(std::make_unique<Good::Rectangle>(4.0, 6.0));
        shapes.push_back(std::make_unique<Good::Triangle>(3.0, 8.0));
        shapes.push_back(std::make_unique<Good::RegularHexagon>(4.0)); // new shape — no edits needed

        calc.printBreakdown(shapes);
    }

    return 0;
}
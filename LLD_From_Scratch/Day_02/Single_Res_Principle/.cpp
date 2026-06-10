/**
 * Single Responsibility Principle (SRP)
 * ======================================
 * "A class should have only one reason to change."
 *
 * This example models an Invoice system.
 *
 * BAD DESIGN  : One fat Invoice class handles calculation, printing, AND saving.
 * GOOD DESIGN : Each concern lives in its own dedicated class.
 */

#include <iostream>
#include <fstream>
#include <string>
#include <vector>

// ─────────────────────────────────────────────────────────────
// SHARED DATA MODELS
// ─────────────────────────────────────────────────────────────

struct Item {
    std::string name;
    int         quantity;
    double      unitPrice;
};

// ─────────────────────────────────────────────────────────────
//   BAD DESIGN — Invoice does EVERYTHING
// ─────────────────────────────────────────────────────────────
namespace Bad {

class Invoice {
    std::vector<Item> items;
    double taxRate;

public:
    Invoice(std::vector<Item> items, double taxRate)
        : items(std::move(items)), taxRate(taxRate) {}

    // Responsibility 1: Business logic
    double calculateTotal() const {
        double subtotal = 0;
        for (const auto& item : items)
            subtotal += item.quantity * item.unitPrice;
        return subtotal * (1 + taxRate);
    }

    // Responsibility 2: Printing / UI concern
    void printInvoice() const {
        std::cout << "======= INVOICE =======\n";
        for (const auto& item : items)
            std::cout << item.name << "  x" << item.quantity
                      << "  @ $" << item.unitPrice << "\n";
        std::cout << "Total: $" << calculateTotal() << "\n";
    }

    // Responsibility 3: Persistence concern
    void saveToFile(const std::string& filename) const {
        std::ofstream file(filename);
        file << "Total: " << calculateTotal() << "\n";
        std::cout << "[Bad] Invoice saved to " << filename << "\n";
    }
};

// Problems:
//   • Finance team changes tax logic  → modifies Invoice
//   • UI team changes print format    → modifies Invoice
//   • DBA changes storage format      → modifies Invoice
// Every unrelated change risks breaking the others.

} // namespace Bad


// ─────────────────────────────────────────────────────────────
//   GOOD DESIGN — One responsibility per class
// ─────────────────────────────────────────────────────────────
namespace Good {

// --- Pure data model ------------------------------------------
struct Invoice {
    std::vector<Item> items;
    double            taxRate;
};

// --- Responsibility 1: Business logic -------------------------
class InvoiceCalculator {
public:
    double calculateTotal(const Invoice& inv) const {
        double subtotal = 0;
        for (const auto& item : inv.items)
            subtotal += item.quantity * item.unitPrice;
        return subtotal * (1 + inv.taxRate);
    }
};

// --- Responsibility 2: Printing / presentation ----------------
class InvoicePrinter {
    const InvoiceCalculator& calc;
public:
    explicit InvoicePrinter(const InvoiceCalculator& c) : calc(c) {}

    void print(const Invoice& inv) const {
        std::cout << "======= INVOICE =======\n";
        for (const auto& item : inv.items)
            std::cout << item.name << "  x" << item.quantity
                      << "  @ $" << item.unitPrice << "\n";
        std::cout << "Total: $" << calc.calculateTotal(inv) << "\n";
    }
};

// --- Responsibility 3: Persistence ----------------------------
class InvoiceRepository {
    const InvoiceCalculator& calc;
public:
    explicit InvoiceRepository(const InvoiceCalculator& c) : calc(c) {}

    void saveToFile(const Invoice& inv, const std::string& filename) const {
        std::ofstream file(filename);
        file << "Total: " << calc.calculateTotal(inv) << "\n";
        std::cout << "[Good] Invoice saved to " << filename << "\n";
    }
};

// Each class now has ONE reason to change:
//   InvoiceCalculator  — only when tax / pricing rules change
//   InvoicePrinter     — only when display format changes
//   InvoiceRepository  — only when storage medium changes

} // namespace Good


// ─────────────────────────────────────────────────────────────
// DEMO
// ─────────────────────────────────────────────────────────────

int main() {
    std::vector<Item> items = {
        {"Widget A", 3, 10.00},
        {"Widget B", 1, 25.50},
    };

    std::cout << "===== BAD DESIGN =====\n";
    {
        Bad::Invoice inv(items, 0.10);
        inv.printInvoice();
        inv.saveToFile("bad_invoice.txt");
    }

    std::cout << "\n===== GOOD DESIGN =====\n";
    {
        Good::Invoice inv{items, 0.10};

        Good::InvoiceCalculator  calculator;
        Good::InvoicePrinter     printer(calculator);
        Good::InvoiceRepository  repo(calculator);

        printer.print(inv);
        repo.saveToFile(inv, "good_invoice.txt");
    }

    return 0;
}
# fnforge

fnforge is a new, universal standard for functions. It aims to provide a consistent way to define, discover, and execute functions across different platforms and programming languages.

## The Problem

Traditionally, functions are exposed and consumed in various ways:
- **CLI**: Arguments and flags, often string-based and parsed manually.
- **REST**: JSON payloads, headers, and query parameters, with varied schemas.
- **Programming Languages**: Language-specific types, interfaces, and calling conventions.

Each of these methods defines inputs and outputs differently, leading to fragmentation and the need for constant translation between formats.

## The Standard

fnforge introduces a unified approach. In this standard, every function must explicitly define:
- The **type of input** (In)
- The **type of output** (Out)

By standardizing these definitions, fnforge enables seamless interoperability across diverse environments.

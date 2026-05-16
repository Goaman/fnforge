# fnforge

> **Note**: This project is a **Work in Progress (WIP)**.

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

The format also specifies **bidirectional communication**, allowing for interactive or streaming exchanges between the caller and the function. 

Notably, fnforge focuses on the communication contract and data structures **without necessarily specifying the transport data layer**. This allows the standard to be implemented over various protocols (like WebSockets, gRPC, HTTP/3, or even local pipes) while maintaining a consistent functional interface.


export const INTERNAL_KNOWLEDGE_BASE = `
# Project Nova Technical Specification

## Overview
Project Nova is an advanced distributed computing framework designed for high-performance AI inference. It utilizes a mesh network architecture to load-balance model weights across multiple edge nodes.

## Key Components
1. **NovaCore**: The central orchestration engine. It handles scheduling, task distribution, and node health monitoring.
2. **NovaEdge**: Lightweight workers that execute inference tasks. Supports WASM and native kernels.
3. **NovaSync**: A low-latency state synchronization protocol using a proprietary binary format.

## Connectivity Protocols
- NovaMesh: A customized P2P protocol for intra-node communication.
- SecureGate: An encrypted TLS 1.3 gateway for external API access.

## Maintenance & Support
- System updates are performed via "Rolling Hot Swaps" to ensure zero downtime.
- Log data is stored in a decentralized audit trail for 90 days.
- Developer contact: tech-support@project-nova.io

## Security Features
- End-to-end encryption for all data packets.
- Zero-trust architecture implementation at the NovaEdge layer.
- Hardware-based root of trust (TPM 2.0 required).
`;

# Database

This folder contains database models, schemas, and database-related utilities.

**Purpose:** Domain-agnostic database logic (Prisma models, queries, migrations) that can be used by any feature or app layer.

**Dependency Rules:** This is part of the Shared Layer. It CANNOT import from Features or App layers.

For more details on folder structure and rules, see [README.md](../../README.md).

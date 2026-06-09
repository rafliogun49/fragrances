#!/bin/bash
# Seed the local D1 database for development
# Usage: bash scripts/seed-local.sh

set -e

echo "Creating schema..."
wrangler d1 execute hmns-db --local --file=migrations/001_schema.sql

echo "Seeding products..."
wrangler d1 execute hmns-db --local --file=migrations/002_seed.sql

echo "Done. 25 products seeded."

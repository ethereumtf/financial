#!/bin/bash

# USD Financial Database Setup Script
# This script initializes the Netlify DB (Neon) database with the complete schema

set -e  # Exit on any error

echo "🚀 USD Financial Database Setup Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set!"
    print_warning "Please set your Netlify DB connection string:"
    echo "export DATABASE_URL='postgresql://username:password@host:port/database'"
    exit 1
fi

print_status "Database URL found: ${DATABASE_URL:0:20}..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    print_error "psql is not installed!"
    print_warning "Please install PostgreSQL client:"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu: sudo apt-get install postgresql-client"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

print_success "PostgreSQL client found"

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    if [ ! -f "$file" ]; then
        print_error "File not found: $file"
        return 1
    fi
    
    print_status "Running $description..."
    if psql "$DATABASE_URL" -f "$file" -v ON_ERROR_STOP=1 --quiet; then
        print_success "$description completed"
        return 0
    else
        print_error "$description failed"
        return 1
    fi
}

# Function to test database connection
test_connection() {
    print_status "Testing database connection..."
    if psql "$DATABASE_URL" -c "SELECT version();" --quiet > /dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Failed to connect to database"
        return 1
    fi
}

# Function to check if database is already initialized
check_existing_schema() {
    print_status "Checking existing schema..."
    
    # Check if users table exists
    if psql "$DATABASE_URL" -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'users';" --quiet --tuples-only | grep -q 1; then
        print_warning "Database appears to already be initialized (users table exists)"
        read -p "Do you want to continue anyway? This may cause errors. (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Aborted by user"
            exit 0
        fi
    else
        print_success "Database is clean, proceeding with initialization"
    fi
}

# Main setup function
main() {
    print_status "Starting USD Financial Database Setup"
    print_status "======================================"
    
    # Test connection first
    if ! test_connection; then
        exit 1
    fi
    
    # Check existing schema
    check_existing_schema
    
    # Define migration files in order
    migrations=(
        "database/migrations/001_initial_schema.sql:Initial Schema (Core Tables)"
        "database/migrations/002_investment_tables.sql:Investment Management Tables"  
        "database/migrations/003_card_system.sql:Card System Tables"
        "database/migrations/004_business_loans_insurance.sql:Business, Loans, and Insurance Tables"
        "database/migrations/005_notifications_security.sql:Notifications and Security"
    )
    
    # Run migrations
    print_status "Running database migrations..."
    for migration in "${migrations[@]}"; do
        IFS=':' read -r file description <<< "$migration"
        if ! run_sql_file "$file" "$description"; then
            print_error "Migration failed: $file"
            exit 1
        fi
        sleep 1  # Brief pause between migrations
    done
    
    # Ask about seed data
    echo
    read -p "Would you like to load sample/seed data for development? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if run_sql_file "database/seed-data.sql" "Seed Data Loading"; then
            print_success "Sample data loaded successfully"
        else
            print_warning "Seed data loading failed, but core schema is intact"
        fi
    else
        print_status "Skipping seed data"
    fi
    
    # Final verification
    print_status "Verifying database setup..."
    
    # Count tables
    table_count=$(psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" --quiet --tuples-only | tr -d ' ')
    
    if [ "$table_count" -gt 30 ]; then
        print_success "Database setup completed successfully!"
        print_success "Created $table_count tables"
        
        # Show summary
        echo
        print_status "Database Summary:"
        print_status "=================="
        psql "$DATABASE_URL" -c "
        SELECT 
            schemaname as schema,
            tablename as table_name,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
        LIMIT 10;" --quiet
        
    else
        print_error "Database setup may be incomplete (only $table_count tables created)"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
}

# Set trap for cleanup
trap cleanup EXIT

# Run main function
main "$@"

print_success "🎉 USD Financial Database is ready!"
print_status "You can now:"
print_status "  - Connect your application using DATABASE_URL"
print_status "  - View database documentation in database/README.md"
print_status "  - Run backup scripts from scripts/backup-database.sh"
echo
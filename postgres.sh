#!/bin/bash

# PostgreSQL Docker Management Script

case "$1" in
  "start")
    echo "Starting PostgreSQL container..."
    docker-compose up -d
    echo "PostgreSQL is starting up. Wait a moment for it to be ready."
    ;;
  "stop")
    echo "Stopping PostgreSQL container..."
    docker-compose down
    ;;
  "restart")
    echo "Restarting PostgreSQL container..."
    docker-compose restart
    ;;
  "logs")
    echo "Showing PostgreSQL logs..."
    docker-compose logs -f postgres
    ;;
  "status")
    echo "PostgreSQL container status:"
    docker-compose ps
    ;;
  "psql")
    echo "Connecting to PostgreSQL..."
    docker-compose exec postgres psql -U postgres -d unsplash_clone
    ;;
  "reset")
    echo "Resetting PostgreSQL data (this will delete all data)..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker-compose down -v
      docker-compose up -d
      echo "PostgreSQL has been reset."
    else
      echo "Reset cancelled."
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|status|psql|reset}"
    echo ""
    echo "Commands:"
    echo "  start   - Start PostgreSQL container"
    echo "  stop    - Stop PostgreSQL container"
    echo "  restart - Restart PostgreSQL container"
    echo "  logs    - Show PostgreSQL logs"
    echo "  status  - Show container status"
    echo "  psql    - Connect to PostgreSQL shell"
    echo "  reset   - Reset all data (WARNING: deletes everything)"
    exit 1
    ;;
esac

#!/bin/bash
# Find and remove all __pycache__ directories recursively from the current directory
find . -type d -name "__pycache__" -exec rm -rf {} +
echo "Successfully removed all __pycache__ directories."

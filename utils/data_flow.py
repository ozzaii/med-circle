"""
A robust and scalable data processing pipeline.

This module provides a structured framework for defining and executing
data processing workflows. It is designed to be modular, easily extensible,
and resilient to errors.

The pipeline follows a standard Extract, Transform, Load (ETL) pattern:
1.  **Extract**: Retrieve raw data from a source (e.g., API, database, file).
2.  **Transform**: Clean, process, and enrich the data into a desired format.
3.  **Load**: Store the processed data into a destination (e.g., data warehouse, file).
"""

import logging
from typing import Any, Dict, List, Optional

# Configure a basic logger for visibility into the pipeline's execution.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


class DataValidationError(Exception):
    """Custom exception for data validation errors during transformation."""
    pass


def extract_data(source: str) -> List[Dict[str, Any]]:
    """
    Extracts data from a given source.

    In a real-world scenario, this function would contain logic to connect
    to a database, call an API, or read from a file system.

    Args:
        source: An identifier for the data source (e.g., a URL, a file path).

    Returns:
        A list of records, where each record is a dictionary.
    
    Raises:
        IOError: If the data source is unreachable or cannot be read.
    """
    logging.info(f"Extracting data from {source}...")
    try:
        # Placeholder for actual data extraction logic.
        # Simulating a raw data pull from a fictional source.
        raw_data = [
            {"id": 1, "user": "alpha", "value": 100, "status": "active"},
            {"id": 2, "user": "beta", "value": 200, "status": "inactive"},
            {"id": 3, "user": "gamma", "value": None, "status": "active"},
        ]
        logging.info(f"Successfully extracted {len(raw_data)} records.")
        return raw_data
    except Exception as e:
        logging.error(f"Failed to extract data from {source}: {e}")
        raise IOError(f"Could not read from data source: {source}") from e


def transform_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Transforms raw data into a clean, processed format.

    This function handles data cleaning, validation, and enrichment.

    Args:
        data: A list of raw data records.

    Returns:
        A list of transformed and validated data records.

    Raises:
        DataValidationError: If a record fails a critical validation check.
    """
    logging.info("Transforming data...")
    transformed_records = []
    for record in data:
        try:
            # 1. Validate: Ensure essential fields are present.
            if "id" not in record or record.get("user") is None:
                raise DataValidationError(f"Missing critical fields in record: {record}")

            # 2. Clean: Handle missing or null values.
            record["value"] = record.get("value") or 0

            # 3. Enrich: Add new, derived information.
            record["is_active"] = record.get("status") == "active"

            # 4. Normalize: Standardize data formats.
            record["user"] = record["user"].upper()

            transformed_records.append(record)
        except DataValidationError as e:
            logging.warning(f"Skipping record due to validation error: {e}")
            continue # Skip malformed records but log a warning.
    
    logging.info(f"Successfully transformed {len(transformed_records)} records.")
    return transformed_records


def load_data(data: List[Dict[str, Any]], destination: str) -> None:
    """
    Loads transformed data to a specified destination.

    In a real-world scenario, this could be a database insert,
    writing to a file, or loading into a data warehouse.

    Args:
        data: The list of transformed records to load.
        destination: An identifier for the target destination.
    """
    logging.info(f"Loading data to {destination}...")
    # Placeholder for data loading logic.
    # Here, we will just log the data that would be loaded.
    for record in data:
        logging.info(f"LOADED_RECORD: {record}")
    logging.info(f"Successfully loaded {len(data)} records to {destination}.")


def run_pipeline(source: str, destination: str) -> None:
    """
    Executes the full ETL data pipeline.

    Args:
        source: The data source identifier.
        destination: The data destination identifier.
    """
    logging.info("Data pipeline starting...")
    try:
        raw_data = extract_data(source)
        transformed_data = transform_data(raw_data)
        load_data(transformed_data, destination)
        logging.info("Data pipeline finished successfully.")
    except (IOError, DataValidationError) as e:
        logging.error(f"Data pipeline failed: {e}")
    except Exception as e:
        logging.critical(f"An unexpected error occurred in the pipeline: {e}")


if __name__ == "__main__":
    # Example usage of the data pipeline.
    # This demonstrates how to run the full ETL process.
    DATA_SOURCE = "api://example-source/data"
    DATA_DESTINATION = "database://production/processed_data"
    
    run_pipeline(source=DATA_SOURCE, destination=DATA_DESTINATION) 
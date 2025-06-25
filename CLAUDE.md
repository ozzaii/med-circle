# Project: ETL Data Pipeline

This repository contains a modular and scalable ETL (Extract, Transform, Load) data processing pipeline written in Python.

## Core Components

- `utils/data_flow.py`: The main entrypoint and definition of the ETL pipeline. It is designed with distinct stages for extraction, transformation, and loading.

## How it Works

1.  **Extract**: `extract_data()` fetches raw data. This is a placeholder for a real data source connection.
2.  **Transform**: `transform_data()` cleans, validates, enriches, and normalizes the data. It includes robust error handling for malformed records.
3.  **Load**: `load_data()` sends the processed data to a target destination. This is a placeholder for a real data loading mechanism.

## How to Run

The pipeline can be executed directly from the command line:

```bash
python3 utils/data_flow.py
```

This will run the example pipeline defined in the `if __name__ == "__main__"` block. 
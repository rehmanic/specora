# EconoRAG - Economic Feasibility Service

Please place your SEERA cost estimation dataset (CSV or XLSX) in this directory.

Expected filename: `SEERA_cost_estimation_dataset_for_prediction.csv` or similar.

After placing the data, run from the EffortLens root:

```powershell
python src\preprocessor.py --input data\raw\SEERA_cost_estimation_dataset_for_prediction.csv --out_processed data\processed
```

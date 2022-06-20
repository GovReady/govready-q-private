# ABOUT Integration Example

## Configure

### Step 1: Create an Integration record in Django admin:

- Name: controlmatrix
- Description: Integration to support Example service
- Config:
```json
{
    "base_url": "http://controlmatrix-test.agency.gov/controlmatrix/api",
    "personal_access_token": "<personal_access_token>"
}
```
- Config schema:
```json
{}
```

For local dev and testing, create an Integration record in Django admin for CSAM mock service:

- Name: controlmatrix
- Description: Integration to support Example service
- Config:
```json
{
    "base_url": "http://localhost:9009",
    "personal_access_token": "FAD619"
}
```
- Config schema:
```json
{}
```

### Step 2: Add route to `integration.urls.py`

```python
url(r"^controlmatrix/", include("integrations.controlmatrix.urls")),
```

## Testing with Mock Service

The Example integration includes a mock Example service you can launch in the terminal to test your integration.

To launch the mock service do the following in a separate terminal from the root directory of GovReady-Q:

```python
pip install click
python integrations/controlmatrix/mock.py
```
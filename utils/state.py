import os
import joblib
from typing import Any, Dict


STATE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'app_state.pkl')


def save_state(state: Dict[str, Any], path: str = STATE_FILE) -> str:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(state, path)
    return path


def load_state(path: str = STATE_FILE) -> Dict[str, Any]:
    if os.path.exists(path):
        try:
            return joblib.load(path)
        except Exception:
            return {}
    return {}

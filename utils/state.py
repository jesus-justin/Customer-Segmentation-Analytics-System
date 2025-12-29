"""
STATE Module
Enhanced utility module for customer segmentation analytics
Last updated: 2025-12-29
"""
import os
import joblib
from datetime import datetime
from typing import Any, Dict, List


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


def get_state_history(path: str = STATE_FILE) -> List[Dict[str, Any]]:
    """Return simple metadata about saved analysis state."""
    if not os.path.exists(path):
        return []
    try:
        mtime = datetime.fromtimestamp(os.path.getmtime(path)).isoformat()
        size_bytes = os.path.getsize(path)
        return [{
            'path': path,
            'last_modified': mtime,
            'size_bytes': size_bytes
        }]
    except Exception:
        return []


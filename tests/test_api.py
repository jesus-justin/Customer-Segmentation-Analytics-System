import unittest
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from app import app

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health(self):
        rv = self.client.get('/health')
        self.assertEqual(rv.status_code, 200)
        self.assertIn('status', rv.get_json())

    def test_status(self):
        rv = self.client.get('/api/status')
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertIn('data_loaded', data)
        self.assertIn('clusters_performed', data)

    def test_analytics_page(self):
        rv = self.client.get('/analytics', headers={'Accept': 'text/html'})
        self.assertEqual(rv.status_code, 200)
        self.assertIn(b'Customer Segmentation Analytics System', rv.data)

    def test_404_html(self):
        rv = self.client.get('/nonexistent', headers={'Accept': 'text/html'})
        self.assertEqual(rv.status_code, 404)
        self.assertIn(b'Page Not Found', rv.data)

if __name__ == '__main__':
    unittest.main()

from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

GEM_PACKS = [
    {"id": "pack1", "gems": 50, "price": 0.99},
    {"id": "pack2", "gems": 120, "price": 1.99},
    {"id": "pack3", "gems": 250, "price": 3.99},
    {"id": "pack4", "gems": 600, "price": 8.99},
]


@app.route('/')
def index():
    return render_template('index.html', packs=GEM_PACKS)


@app.route('/purchase', methods=['POST'])
def purchase():
    data = request.get_json() or {}
    user_id = (data.get('user_id') or '').strip()
    pack_id = data.get('pack_id')
    promo_code = (data.get('promo_code') or '').strip().upper()

    # Basic validation: numeric user id exactly 8 digits
    if not re.match(r'^\d{8}$', user_id):
        return jsonify({'success': False, 'error': 'Invalid user id format (must be 8 digits)'}), 400

    pack = next((p for p in GEM_PACKS if p['id'] == pack_id), None)
    if not pack:
        return jsonify({'success': False, 'error': 'Invalid pack selected'}), 400

    # Promo code logic: first pack free if code is NIGHTFURY and user chose pack1
    discount = 0.0
    free_offer = False
    if promo_code == 'NIGHTFURY' and pack_id == 'pack1':
        discount = pack['price']
        free_offer = True

    # Mock processing (no real payment integration)
    order = {
        'order_id': f'MOCK-{user_id[-6:]}-{pack_id}',
        'user_id': user_id,
        'gems': pack['gems'],
        'price': pack['price'] - discount,
        'discount': discount,
        'promo_code': promo_code,
        'status': 'delivered',
        'free_offer': free_offer
    }

    return jsonify({'success': True, 'order': order})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

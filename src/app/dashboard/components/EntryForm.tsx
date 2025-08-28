'use client';
import { useState, FormEvent } from 'react';
import { addEntry } from '@/app/actions/entries';

type EntryFormState = {
  tradeDate: string;
  pair: 'JPY/KRW' | 'JPY/USD' | 'USD/KRW';
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  fee: number;
  memo: string;
};

export default function EntryForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EntryFormState>({
    tradeDate: new Date().toISOString().slice(0, 10),
    pair: 'JPY/KRW',
    action: 'BUY',
    amount: 10000,
    price: 9.5,
    fee: 0,
    memo: '',
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await addEntry(form);
      alert('Saved');
    } catch (e) {
      alert((e as Error).message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h3>거래 추가하기</h3>
      <label>Date</label>
      <input
        type="date"
        value={form.tradeDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, tradeDate: e.target.value })
        }
        required
      />

      <label>Pair</label>
      <select
        value={form.pair}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setForm({
            ...form,
            pair: e.target.value as 'JPY/KRW' | 'JPY/USD' | 'USD/KRW',
          })
        }
      >
        <option>JPY/KRW</option>
        <option>JPY/USD</option>
        <option>USD/KRW</option>
      </select>

      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Action</label>
          <select
            value={form.action}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setForm({ ...form, action: e.target.value as 'BUY' | 'SELL' })
            }
          >
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Price</label>
          <input
            type="number"
            step="0.0001"
            value={form.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <label>Fee</label>
      <input
        type="number"
        step="0.01"
        value={form.fee}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, fee: Number(e.target.value) })
        }
      />

      <label>Memo</label>
      <textarea
        style={{ width: '100%' }}
        value={form.memo}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setForm({ ...form, memo: e.target.value })
        }
      />

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

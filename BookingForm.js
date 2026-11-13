'use client';
import { useState } from 'react';

export default function BookingForm() {
  const [patientData, setPatientData] = useState({ name: '', phone: '', hospital: '', date: '' });
  const [status, setStatus] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setStatus('جاري تأكيد الحجز...');

    try {
      // إرسال الطلب إلى الخادم الوسيط الخاص بنا
      const res = await fetch('/api/odoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'calendar.event', // الموديول المسؤول عن المواعيد في Odoo
          data: {
            name: `كشف جديد: ${patientData.name}`,
            start_date: patientData.date,
            description: `Hospital: ${patientData.hospital} | Phone: ${patientData.phone}`
          }
        })
      });

      if (res.ok) {
        setStatus('تم تأكيد الحجز بنجاح وإضافته لقاعدة بيانات المستشفى.');
      }
    } catch (error) {
      setStatus('حدث خطأ أثناء الحجز، يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md rtl">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">احجز كشفك الطبي</h2>
      <form onSubmit={handleBooking} className="space-y-4">
        <input 
          type="text" 
          placeholder="الاسم الثلاثي" 
          className="w-full p-2 border rounded"
          onChange={e => setPatientData({...patientData, name: e.target.value})}
        />
        <select 
          className="w-full p-2 border rounded"
          onChange={e => setPatientData({...patientData, hospital: e.target.value})}
        >
          <option value="">اختر المستشفى</option>
          <option value="dar-alfouad">مستشفى دار الفؤاد</option>
          <option value="ahl-masr">مستشفى أهل مصر</option>
        </select>
        <input 
          type="datetime-local" 
          className="w-full p-2 border rounded"
          onChange={e => setPatientData({...patientData, date: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          تأكيد الحجز
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-600 font-medium">{status}</p>}
    </div>
  );
}

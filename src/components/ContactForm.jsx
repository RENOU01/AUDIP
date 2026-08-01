import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { supabase } from '../supabaseClient'
import { DEPARTAMENTOS } from '../lib/departamentos'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const estadoInicial = {
  nombre: '',
  telefono: '',
  email: '',
  departamento: '',
  mensaje: '',
  // campo trampa para bots (honeypot): un humano nunca lo completa
  sitio_web: '',
}

export default function ContactForm() {
  const [form, setForm] = useState(estadoInicial)
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()

    // Anti-spam simple: si el honeypot viene completo, se descarta en silencio.
    if (form.sitio_web) {
      setEstado('ok')
      setForm(estadoInicial)
      return
    }

    setEstado('enviando')
    try {
      const { error: dbError } = await supabase.from('contactos').insert({
        nombre: form.nombre,
        telefono: form.telefono,
        email: form.email,
        departamento: form.departamento,
        mensaje: form.mensaje,
      })
      if (dbError) throw dbError

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: form.nombre,
            from_email: form.email,
            telefono: form.telefono,
            departamento: form.departamento,
            mensaje: form.mensaje,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        )
      }

      setEstado('ok')
      setForm(estadoInicial)
    } catch (err) {
      console.error(err)
      setEstado('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot: oculto para personas, visible para bots */}
      <input
        type="text"
        name="sitio_web"
        value={form.sitio_web}
        onChange={onChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Campo label="Nombre y apellido" name="nombre" value={form.nombre} onChange={onChange} required />
        <Campo label="Teléfono de contacto" name="telefono" value={form.telefono} onChange={onChange} required type="tel" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Campo label="Correo electrónico" name="email" value={form.email} onChange={onChange} required type="email" />
        <div>
          <label className="block text-sm font-medium text-institutional-700 mb-1.5" htmlFor="departamento">
            Departamento
          </label>
          <select
            id="departamento"
            name="departamento"
            value={form.departamento}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none"
          >
            <option value="" disabled>Seleccioná tu departamento</option>
            {DEPARTAMENTOS.map((d) => (
              <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-institutional-700 mb-1.5" htmlFor="mensaje">
          Motivo de contacto
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={onChange}
          required
          rows={5}
          placeholder="Contanos tu consulta o el fenómeno que querés reportar…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="btn-primary disabled:opacity-60"
      >
        {estado === 'enviando' && <Loader2 size={16} className="animate-spin" />}
        Enviar mensaje
      </button>

      {estado === 'ok' && (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Mensaje enviado. Te vamos a responder a la brevedad.
        </p>
      )}
      {estado === 'error' && (
        <p className="flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={16} /> Ocurrió un error al enviar. Probá de nuevo o escribinos directamente a audipuruguay@gmail.com.
        </p>
      )}
    </form>
  )
}

function Campo({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-institutional-700 mb-1.5" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none"
      />
    </div>
  )
}

import React from 'react'
import { Card } from 'react-bootstrap'

export default function TherapistCard({ therapist }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{therapist.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{therapist.specialty}</Card.Subtitle>
        <Card.Text>
          <strong>Días disponibles:</strong> {therapist.availableDays?.join(', ') || 'No definidos'}<br />
          <strong>Sesiones atendidas:</strong> {therapist.sessions}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
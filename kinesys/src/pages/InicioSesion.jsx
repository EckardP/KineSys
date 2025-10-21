import React from 'react'
import * as bootstrap from 'react-bootstrap'
import '../App.css'
export default function inicioSesion() {
  return (
    <div className="contenedor-usuario">
       <form >
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Correo Electronico</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" class="form-text">No compartas tu correo electronico con nadie.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Contraseña</label>
    <input type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Comprobar</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
    </div>
   
    
  )
}

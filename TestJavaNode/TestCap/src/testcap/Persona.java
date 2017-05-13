/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package testcap;

/**
 *
 * @author Emmanuel
 */
public class Persona implements Comparable {
    private int idPersona;
    private String nombre;
    private int altura;

    public Persona (int idPersona, String nombre, int altura) {
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.altura = altura;}

    @Override
    public String toString() {
        return "Persona-> ID: "+idPersona+" Nombre: "+nombre+" Altura: "+altura + "\n";
    }

    @Override
    public int compareTo(Object o) {
        Persona p = (Persona) o;
        return this.altura - p.altura;
    }

    public int getIdPersona() {return idPersona;}
    public String getNombre() {return nombre;}
    public int getAltura() {return altura;}
}

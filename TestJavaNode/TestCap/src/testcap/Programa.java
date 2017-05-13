/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package testcap;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 *
 * @author Emmanuel
 */
public class Programa {
    public static void main(String arg[]) {
        List<Persona> listaPersonas = new ArrayList<Persona>();
        listaPersonas.add(new Persona(1,"Maria",185));
        listaPersonas.add(new Persona(2,"Carla",190));
        listaPersonas.add(new Persona(3,"Yovana",170));
        //Collections.sort(listaPersonas);  // Ejemplo uso ordenación natural
        Collections.sort(listaPersonas, new OrdenarPersonaPorAltura());
        System.out.println("Personas Ordenadas por orden natural: "+listaPersonas);
      } 
}

const TIPOS_NEURONA = {
    SENSORIAL: 'sensorial',
    MOTORA: 'motora',
    INTERNEURONA: 'interneurona'
};
class Neurona {
    constructor(id, tipo) {
        this.id = id;
        this.tipo = tipo;
        this.conexiones = [];
        this.potencialDeAccion = 0;
        this.umbral = 1;
    }
    conectar(neurona, tipoSinapsis = 'excitaria') {
        if (!this.conexiones.some(conexion => conexion.neurona === neurona)) {
            this.conexiones.push({ neurona, tipoSinapsis });
            neurona.conexiones.push({ neurona: this, tipoSinapsis });
        }
    }
    recibirSenal(intensidad, tipoSinapsis) {
        if (tipoSinapsis === 'excitaria') {
            this.potencialDeAccion += intensidad;
        } else if (tipoSinapsis === 'inhibitoria') {
            this.potencialDeAccion -= intensidad;
        }
        if (this.potencialDeAccion >= this.umbral) {
            this.disparar();
        }
    }
    disparar() {
        console.log(`Neurona ${this.id} (${this.tipo}) dispara un potencial de acción!`);
        this.potencialDeAccion = 0;

        this.conexiones.forEach(conexion => {
            conexion.neurona.recibirSenal(0.5, conexion.tipoSinapsis);
        });
    }
    mostrarConexiones() {
        console.log(`Neurona ${this.id} (${this.tipo}) está conectada con: ${this.conexiones.map(c => `${c.neurona.id} (${c.neurona.tipo}) [${c.tipoSinapsis}]`).join(", ")}`);
    }
}
class Neurogenesis {
    constructor() {
        this.neuronas = [];
    }
    crearNeurona(tipo) {
        const nuevaNeurona = new Neurona(this.neuronas.length + 1, tipo);
        this.neuronas.push(nuevaNeurona);
        return nuevaNeurona;
    }
    conectarNeuronas(neurona1, neurona2, tipoSinapsis = 'excitaria') {
        neurona1.conectar(neurona2, tipoSinapsis);
    }
    mostrarConexiones() {
        this.neuronas.forEach(neurona => neurona.mostrarConexiones());
    }
    simularCerebro(numNeuronasSensoriales, numNeuronasMotoras, numInterneuronas) {
        for (let i = 0; i < numNeuronasSensoriales; i++) {
            this.crearNeurona(TIPOS_NEURONA.SENSORIAL);
        }
        for (let i = 0; i < numNeuronasMotoras; i++) {
            this.crearNeurona(TIPOS_NEURONA.MOTORA);
        }
        for (let i = 0; i < numInterneuronas; i++) {
            this.crearNeurona(TIPOS_NEURONA.INTERNEURONA);
        }
        this.neuronas.forEach((neurona, index) => {
            const numConexiones = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < numConexiones; i++) {
                const aleatoria = this.neuronas[Math.floor(Math.random() * this.neuronas.length)];
                if (neurona !== aleatoria) {
                    const tipoSinapsis = Math.random() > 0.8 ? 'inhibitoria' : 'excitaria';
                    this.conectarNeuronas(neurona, aleatoria, tipoSinapsis);
                }
            }
        });
    }
}
const neurogenesis = new Neurogenesis();
neurogenesis.simularCerebro(3, 3, 4);
neurogenesis.mostrarConexiones();
console.log("\nEstimulación de una neurona sensorial:\n");
const neuronaSensorial = neurogenesis.neuronas.find(neurona => neurona.tipo === TIPOS_NEURONA.SENSORIAL);
neuronaSensorial.recibirSenal(1.2, 'excitaria');

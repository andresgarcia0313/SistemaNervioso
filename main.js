console.log("Bienvenido");

// Definición de tipos de neuronas
const TIPOS_NEURONA = {
    SENSORIAL: 'sensorial',
    MOTORA: 'motora',
    INTERNEURONA: 'interneurona'
};

// Clase Neurona mejorada
class Neurona {
    constructor(id, tipo) {
        this.id = id;
        this.tipo = tipo;
        this.conexiones = [];
        this.potencialDeAccion = 0; // Valor inicial del potencial de acción
        this.umbral = 1; // Umbral para generar un potencial de acción
    }

    // Método para conectar esta neurona con otra neurona
    conectar(neurona, tipoSinapsis = 'excitaria') {
        if (!this.conexiones.some(conexion => conexion.neurona === neurona)) {
            this.conexiones.push({ neurona, tipoSinapsis });
            neurona.conexiones.push({ neurona: this, tipoSinapsis }); // Conexión bidireccional
        }
    }

    // Método para recibir una señal (estimulación)
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

    // Método para disparar un potencial de acción
    disparar() {
        console.log(`Neurona ${this.id} (${this.tipo}) dispara un potencial de acción!`);
        this.potencialDeAccion = 0; // Reiniciar el potencial de acción

        // Enviar señal a las neuronas conectadas
        this.conexiones.forEach(conexion => {
            conexion.neurona.recibirSenal(0.5, conexion.tipoSinapsis); // Transmisión de señal con intensidad reducida
        });
    }

    // Método para mostrar las conexiones de esta neurona
    mostrarConexiones() {
        console.log(`Neurona ${this.id} (${this.tipo}) está conectada con: ${this.conexiones.map(c => `${c.neurona.id} (${c.neurona.tipo}) [${c.tipoSinapsis}]`).join(", ")}`);
    }
}

// Clase Neurogenesis mejorada
class Neurogenesis {
    constructor() {
        this.neuronas = [];
    }

    // Método para crear una nueva neurona de un tipo específico
    crearNeurona(tipo) {
        const nuevaNeurona = new Neurona(this.neuronas.length + 1, tipo);
        this.neuronas.push(nuevaNeurona);
        return nuevaNeurona;
    }

    // Método para conectar dos neuronas con un tipo de sinapsis
    conectarNeuronas(neurona1, neurona2, tipoSinapsis = 'excitaria') {
        neurona1.conectar(neurona2, tipoSinapsis);
    }

    // Método para mostrar todas las conexiones del cerebro
    mostrarConexiones() {
        this.neuronas.forEach(neurona => neurona.mostrarConexiones());
    }

    // Método para simular la creación de un cerebro simple
    simularCerebro(numNeuronasSensoriales, numNeuronasMotoras, numInterneuronas) {
        // Crear neuronas sensoriales
        for (let i = 0; i < numNeuronasSensoriales; i++) {
            this.crearNeurona(TIPOS_NEURONA.SENSORIAL);
        }

        // Crear neuronas motoras
        for (let i = 0; i < numNeuronasMotoras; i++) {
            this.crearNeurona(TIPOS_NEURONA.MOTORA);
        }

        // Crear interneuronas
        for (let i = 0; i < numInterneuronas; i++) {
            this.crearNeurona(TIPOS_NEURONA.INTERNEURONA);
        }

        // Conectar neuronas aleatoriamente pero con mayor probabilidad de conexiones locales
        this.neuronas.forEach((neurona, index) => {
            const numConexiones = Math.floor(Math.random() * 5) + 1; // Entre 1 y 5 conexiones
            for (let i = 0; i < numConexiones; i++) {
                const aleatoria = this.neuronas[Math.floor(Math.random() * this.neuronas.length)];
                if (neurona !== aleatoria) {
                    const tipoSinapsis = Math.random() > 0.8 ? 'inhibitoria' : 'excitaria'; // 20% de ser inhibitoria
                    this.conectarNeuronas(neurona, aleatoria, tipoSinapsis);
                }
            }
        });
    }
}

// Crear una instancia de Neurogenesis mejorada
const neurogenesis = new Neurogenesis();

// Simular la creación de un cerebro con diferentes tipos de neuronas
neurogenesis.simularCerebro(3, 3, 4);

// Mostrar las conexiones de todas las neuronas
neurogenesis.mostrarConexiones();

// Estimular una neurona sensorial para demostrar el disparo de potencial de acción
console.log("\nEstimulación de una neurona sensorial:\n");
const neuronaSensorial = neurogenesis.neuronas.find(neurona => neurona.tipo === TIPOS_NEURONA.SENSORIAL);
neuronaSensorial.recibirSenal(1.2, 'excitaria'); // Intensidad suficiente para disparar

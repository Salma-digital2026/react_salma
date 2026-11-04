import { useState, useEffect } from "react";
import "./App.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {


const [taches, setTaches] = useState(() => {
    const donnees = localStorage.getItem("taches");

    return donnees
        ? JSON.parse(donnees)
        : [
            { nom: "Créer une page", duree: "2h", statut: "En cours" },
            { nom: "Ajouter CSS", duree: "1h", statut: "Traité" },
            { nom: "Tester le projet", duree: "3h", statut: "Non traité" }
        ];
});

const [nom, setNom] = useState("");
const [duree, setDuree] = useState("");
const [statut, setStatut] = useState("Non traité");
const [recherche, setRecherche] = useState("");


useEffect(() => {
    localStorage.setItem("taches", JSON.stringify(taches));
}, [taches]);


function ajouterTache() {
    if (nom.trim() === "" || duree.trim() === "") {
        alert("Remplir tous les champs");
        return;
    }

    const nouvelleTache = {
        nom: nom.trim(),
        duree: duree.trim(),
        statut: statut
    };

    setTaches([...taches, nouvelleTache]);

    setNom("");
    setDuree("");
    setStatut("Non traité");
}


function supprimerTache(index) {
    setTaches(taches.filter((tache, i) => i !== index));
}


const tachesFiltrees = taches.filter((tache) =>
    tache.nom.toLowerCase().includes(recherche.toLowerCase())
);


const traite = taches.filter(
    (tache) => tache.statut === "Traité"
).length;

const enCours = taches.filter(
    (tache) => tache.statut === "En cours"
).length;

const nonTraite = taches.filter(
    (tache) => tache.statut === "Non traité"
).length;


const data = {
    labels: ["Traité", "En cours", "Non traité"],
    datasets: [
        {
            data: [traite, enCours, nonTraite],
            backgroundColor: ["green", "orange", "red"]
        }
    ]
};

return (
    <div>
        <header>
            <h1>Task Manager</h1>
            <p>Gestion simple des tâches</p>
        </header>

        <main>
            <div className="formulaire">
                <h2>Nouvelle tâche</h2>

                <label>Nom de la tâche</label>
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />

                <label>Durée</label>
                <input
                    type="text"
                    placeholder="Ex: 2h"
                    value={duree}
                    onChange={(e) => setDuree(e.target.value)}
                />

                <label>Statut</label>
                <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                >
                    <option>Non traité</option>
                    <option>En cours</option>
                    <option>Traité</option>
                </select>

                <button onClick={ajouterTache}>
                    Ajouter la tâche
                </button>
            </div>

            <div className="liste">
                <h2>Liste des tâches</h2>

                <input
                    type="text"
                    placeholder="Rechercher une tâche"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="recherche"
                />

                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Nom</th>
                            <th>Durée</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tachesFiltrees.map((tache) => {
                            const indexOriginal = taches.indexOf(tache);

                            return (
                                <tr key={indexOriginal}>
                                    <td>{indexOriginal + 1}</td>
                                    <td>{tache.nom}</td>
                                    <td>{tache.duree}</td>
                                    <td>{tache.statut}</td>
                                    <td>
                                        <button
                                            className="supprimer"
                                            onClick={() =>
                                                supprimerTache(indexOriginal)
                                            }
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {tachesFiltrees.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    Aucune tâche trouvée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="chart">
                <h2>Statistiques des tâches</h2>
                <Doughnut data={data} />
            </div>
        </main>
    </div>
);


}

export default App;

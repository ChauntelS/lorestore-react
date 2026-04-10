import {useEffect, useState} from "react";
import {Link} from "react-router";
import type {LoreSubject} from "../../types/LoreSubject.tsx";

export default function Home() {
    const [loreSubject, setLoreSubject] = useState<LoreSubject[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/loreSubject/');
            const loreSubject = await res.json();
            setLoreSubject(loreSubject)
        }

        fetchData()
    }, [])

    return (
        <section className="page-card intro-card">
            <p className="eyebrow">Featured drops</p>
            <h1>True North Unknown</h1>
            <p className="lead">
                Our store specializes in rare and unique case files on mysterious and often elusive cryptid creatures from folklore and legend.
                We curate collections of artifacts, witness accounts, and photographs that delve into the world of cryptozoology, exploring the unknown and the unexplained.
                Our store is a treasure trove for those fascinated by creatures such as Bigfoot, the Loch Ness Monster, Chupacabra, and many others that have captured the human imagination for centuries.

            </p>
            <div className="callout">
                New merch drops weekly. Explore eyewitness accounts, and creature backstories.
            </div>

            <div className="lore-subjects">
                {loreSubject.length > 0 && (
                    loreSubject.map(loreSubject => (
                        <div key={loreSubject.id} className="lore-subject-card">
                            <Link to={`/details/${loreSubject.id}`} className="lore-subject-link">
                                {loreSubject.name}
                                <img
                                    className="lore-subject-image"
                                    src={loreSubject.imageFilePath}
                                    alt={loreSubject.name}
                                    loading="lazy"
                                />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </section>

    )
}
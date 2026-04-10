import {useEffect, useMemo, useState} from "react";
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

    const featuredCase = useMemo(() => loreSubject[0], [loreSubject]);
    const catalogItems = useMemo(
        () => (loreSubject.length > 1 ? loreSubject.slice(1) : loreSubject),
        [loreSubject]
    );

    return (
        <section className="page-card intro-card">
            <p className="eyebrow">Featured drops</p>
            <h1>True North Unknown</h1>
            <p className="lead">
                Our store specializes in rare and unique case files on mysterious and often elusive cryptid creatures from folklore and legend.
                We curate collections of artifacts, witness accounts, and photographs that delve into the world of cryptozoology, exploring the unknown and the unexplained.
                Our store is a treasure trove for those fascinated by creatures such as Bigfoot, the Loch Ness Monster, Chupacabra, and many others that have captured the human imagination for centuries.
            </p>

            {featuredCase && (
                <article className="featured-case">
                    <div className="featured-case-copy">
                        <p className="eyebrow">Case file of the week</p>
                        <h2>{featuredCase.name}</h2>
                        <p className="featured-case-price">${featuredCase.price.toFixed(2)}</p>
                        <p>
                            Classified field dossier with provenance records, witness timeline, and verified evidence annotations.
                            Recommended for serious collectors of high-value cryptid archives.
                        </p>
                        <div className="featured-case-meta">
                            <span>Region: {featuredCase.region}</span>
                            <span>Evidence: {featuredCase.evidenceLevel}</span>
                            <span>Threat: {featuredCase.threatLevel}</span>
                        </div>
                        <Link to={`/details/${featuredCase.id}`} className="btn btn-primary btn-luxury">Acquire dossier</Link>
                    </div>
                    <div className="featured-case-media">
                        <img
                            className="lore-subject-image"
                            src={featuredCase.imageFilePath}
                            alt={featuredCase.name}
                            loading="lazy"
                        />
                    </div>
                </article>
            )}

            <div className="callout">
                New merch drops weekly. Explore eyewitness accounts, and creature backstories.
            </div>

            <div className="lore-subjects">
                {catalogItems.length > 0 && (
                    catalogItems.map((subject) => {
                        const hasActiveSightings = (subject.activeSightings ?? 0) > 0;

                        return (
                        <article key={subject.id} className="lore-subject-card">
                            <Link to={`/details/${subject.id}`} className="lore-subject-link">
                                <div className="lore-subject-media">
                                    <img
                                        className="lore-subject-image"
                                        src={subject.imageFilePath}
                                        alt={subject.name}
                                        loading="lazy"
                                    />
                                    <span className="rarity-pill">Collector grade</span>
                                </div>
                                <div className="lore-subject-meta">
                                    <p className="lore-subject-kicker">Limited archive release</p>
                                    <h2 className="lore-subject-title">{subject.name}</h2>
                                    <p className="lore-subject-spec">Threat: {subject.threatLevel}</p>
                                    <p className="lore-subject-spec">
                                        Sightings:
                                        <span className={`status-chip lore-subject-status ${hasActiveSightings ? "is-active" : "is-inactive"}`}>
                                            {hasActiveSightings ? "Active" : "Inactive"}
                                        </span>
                                    </p>
                                    <div className="lore-subject-row">
                                        <span className="price-tag">${subject.price.toFixed(2)}</span>
                                        <span className="lore-subject-cta">View dossier</span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                        );
                    })
                )}
            </div>
        </section>

    )
}
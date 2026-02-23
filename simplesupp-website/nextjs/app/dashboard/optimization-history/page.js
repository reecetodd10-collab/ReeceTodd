'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    TrendingUp, TrendingDown, Minus, Calendar,
    Target, Zap, Activity, ChevronRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function OptimizationHistory() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isSignedIn) {
            fetch('/api/optimization-results')
                .then(res => res.json())
                .then(data => {
                    setResults(data.results || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching history:', err);
                    setLoading(false);
                });
        }
    }, [isSignedIn]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view your history</h1>
                <Link
                    href="/sign-in"
                    className="px-6 py-2 bg-accent text-[#001018] rounded-lg font-bold"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    const latestResult = results[0];
    const previousResults = results.slice(0, 5); // Last 5 for chart

    // Calculate bottleneck trend
    const bottlenecks = results.map(r => r.primary_bottleneck);
    const coreBottleneck = bottlenecks.length > 0
        ? bottlenecks.sort((a, b) =>
            bottlenecks.filter(v => v === a).length - bottlenecks.filter(v => v === b).length
        ).pop()
        : 'None detected';

    return (
        <div className="min-h-screen py-12 px-4 bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-accent mb-2">
                            <Activity size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">Performance Dashboard</span>
                        </div>
                        <h1 className="text-4xl font-bold">Optimization History</h1>
                    </div>

                    {latestResult && (
                        <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,255,0.2)' }}>
                            <div>
                                <p className="text-txt-muted text-xs uppercase mb-1">Current Score</p>
                                <p className="text-3xl font-bold text-accent">{(latestResult.optimization_score / 10).toFixed(1)}<span className="text-sm text-txt-muted font-normal ml-1">/10</span></p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <p className="text-txt-muted text-xs uppercase mb-1">Status</p>
                                <p className="text-lg font-medium">
                                    {latestResult.optimization_score >= 75 ? 'Optimal' : latestResult.optimization_score >= 50 ? 'Improving' : 'Action Needed'}
                                </p>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Chart Section */}
                    <div className="md:col-span-2 glass-card p-6 rounded-2xl" style={{ background: 'rgba(20,20,25,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <TrendingUp size={18} className="text-accent" />
                            Score Trend
                        </h3>

                        {results.length > 1 ? (
                            <ScoreChart history={previousResults} />
                        ) : (
                            <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                                <p className="text-txt-muted">Complete more quizzes to see your trend</p>
                            </div>
                        )}
                    </div>

                    {/* Core Bottleneck */}
                    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, rgba(0,217,255,0.05), transparent)', border: '1px solid rgba(0,217,255,0.2)' }}>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Recurring Bottleneck</h3>
                            <p className="text-txt-muted text-sm mb-6">The biggest factor currently limiting your performance.</p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent font-bold">
                                <Target size={18} />
                                {coreBottleneck}
                            </div>
                        </div>

                        <Link href="/supplement-optimization-score" className="mt-8 flex items-center justify-between text-sm text-accent hover:underline">
                            Re-calculate Score
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* History Table */}
                <section>
                    <h3 className="text-xl font-bold mb-6">Recent Results</h3>
                    <div className="space-y-4">
                        {results.slice(0, 5).map((result, idx) => (
                            <div
                                key={result.id}
                                className="glass-card p-5 rounded-xl flex items-center justify-between transition hover:bg-white/5"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center text-accent">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{result.primary_goal}</h4>
                                        <p className="text-xs text-txt-muted flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(result.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 text-right font-medium">
                                    <div>
                                        <p className="text-[10px] text-txt-muted uppercase">Bottleneck</p>
                                        <p className="text-sm">{result.primary_bottleneck}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-txt-muted uppercase">Score</p>
                                        <p className="text-xl text-accent">{(result.optimization_score / 10).toFixed(1)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {results.length === 0 && (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-txt-muted mb-4">No results found yet.</p>
                                <Link href="/supplement-optimization-score" className="px-6 py-2 bg-accent text-[#001018] rounded-lg font-bold">
                                    Start Your First Quiz
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function ScoreChart({ history }) {
    // Simple SVG Line Chart
    const scores = history.map(h => h.optimization_score).reverse();
    const maxScore = 100;
    const width = 400;
    const height = 150;
    const padding = 20;

    const points = scores.map((score, i) => {
        const x = padding + (i * (width - 2 * padding) / (scores.length - 1 || 1));
        const y = height - padding - (score / maxScore * (height - 2 * padding));
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Grid lines */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#00d9ff"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))' }}
                />

                {/* Data points */}
                {scores.map((score, i) => {
                    const x = padding + (i * (width - 2 * padding) / (scores.length - 1 || 1));
                    const y = height - padding - (score / maxScore * (height - 2 * padding));
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#00d9ff" />
                    );
                })}
            </svg>
        </div>
    );
}

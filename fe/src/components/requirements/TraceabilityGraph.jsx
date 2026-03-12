"use client";

import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Loader2, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTraceabilityGraph } from "@/api/requirements";
import { toast } from "sonner";

const getStatusColor = (status) => {
    switch (status) {
        case 'approved': return '#10b981';
        case 'pending': return '#f59e0b';
        case 'rejected': return '#ef4444';
        case 'draft': return '#6b7280';
        default: return '#6b7280';
    }
};

export default function DependencyGraph({ projectId, onClose }) {
    const [data, setData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const fgRef = useRef();

    useEffect(() => {
        async function loadData() {
            try {
                const res = await getTraceabilityGraph(projectId);
                // Transform data for force-graph
                const nodes = res.nodes.map(n => ({
                    ...n,
                    statusColor: getStatusColor(n.status),
                    val: 12
                }));
                const links = res.links.map(l => {
                    if (l.category === 'hierarchy') {
                        return {
                            source: l.target_id,   // child
                            target: l.source_id,   // parent
                            type: l.link_type,
                            category: l.category
                        };
                    }
                    return {
                        source: l.source_id,
                        target: l.target_id,
                        type: l.link_type,
                        category: l.category
                    };
                });
                setData({ nodes, links });
            } catch (error) {
                toast.error("Failed to load dependency graph");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [projectId]);

    // Configure d3 forces for better node spacing
    useEffect(() => {
        if (fgRef.current && data.nodes.length > 0) {
            fgRef.current.d3Force('link')?.distance(150);
            fgRef.current.d3Force('charge')?.strength(-400);
        }
    }, [data]);

    const handleNodeClick = (node) => {
        // Center on node
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-6xl h-[85vh] rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden relative">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <div>
                        <h2 className="text-2xl font-bold font-display">Dependency Graph</h2>
                        <p className="text-sm text-muted-foreground">Interactive map of requirement relationships</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => fgRef.current.zoomToFit(400)}>
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => onClose()}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-black/5 dark:bg-white/5 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ForceGraph2D
                            ref={fgRef}
                            graphData={data}
                            nodeLabel={(node) => `[${node.readable_id}] ${node.title}\nIncoming: ${node._count?.target_links || 0}\nOutgoing: ${node._count?.source_links || 0}`}
                            nodeRelSize={6}
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const id = node.readable_id || "REQ";
                                const fanIn = node._count?.target_links || 0;
                                const fanOut = node._count?.source_links || 0;
                                
                                // Node dimensions (Even larger for generous margins)
                                const width = 85 / globalScale;
                                const height = 50 / globalScale;
                                const r = 10 / globalScale;

                                // Draw node body (Rounded Rect)
                                ctx.beginPath();
                                ctx.roundRect(node.x - width/2, node.y - height/2, width, height, r);
                                ctx.fillStyle = node.statusColor || '#6b7280';
                                ctx.shadowBlur = 12 / globalScale;
                                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                                ctx.fill();
                                ctx.shadowBlur = 0;
                                
                                // Draw border
                                ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                                ctx.lineWidth = 2 / globalScale;
                                ctx.stroke();

                                // 1. Center ID Text (Top Half)
                                const idFontSize = 16 / globalScale;
                                ctx.font = `bold ${idFontSize}px Inter, sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = '#fff';
                                ctx.fillText(id, node.x, node.y - 10/globalScale);

                                // 2. Bottom Metrics Area (Badges)
                                const badgeWidth = width * 0.4;
                                const badgeHeight = 18 / globalScale;
                                const badgeY = node.y + 14 / globalScale;
                                
                                ctx.font = `bold ${10 / globalScale}px Monospace`;
                                
                                // Fan-in Badge (Left)
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                                ctx.beginPath();
                                ctx.roundRect(node.x - width/2 + 6/globalScale, badgeY - badgeHeight/2, badgeWidth, badgeHeight, 5/globalScale);
                                ctx.fill();
                                ctx.fillStyle = '#fff';
                                ctx.fillText(`IN:${fanIn}`, node.x - width/4 - 1/globalScale, badgeY);
                                
                                // Fan-out Badge (Right)
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                                ctx.beginPath();
                                ctx.roundRect(node.x + 2/globalScale, badgeY - badgeHeight/2, badgeWidth, badgeHeight, 5/globalScale);
                                ctx.fill();
                                ctx.fillStyle = '#fff';
                                ctx.fillText(`OUT:${fanOut}`, node.x + width/4 + 1/globalScale, badgeY);
                            }}
                            nodeCanvasObjectMode={() => 'replace'}
                            linkDirectionalArrowLength={5}
                            linkDirectionalArrowRelPos={0.85}
                            linkCurvature={0.2}
                            linkLabel={(link) => link.type === 'child' ? 'hierarchy' : link.type}
                            linkColor={(link) => link.category === 'hierarchy' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(59, 130, 246, 0.4)'}
                            linkDashArray={(link) => link.category === 'dependency' ? [2, 1] : null}
                            d3VelocityDecay={0.3}
                            d3AlphaDecay={0.02}
                            onNodeClick={handleNodeClick}
                            onEngineStop={() => fgRef.current?.zoomToFit(400, 60)}
                            backgroundColor="rgba(0,0,0,0)"
                            width={window.innerWidth > 1200 ? 1150 : window.innerWidth - 64}
                            height={window.innerHeight * 0.65}
                            cooldownTime={3000}
                        />
                    )}
                    
                    {/* Legend */}
                    <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border space-y-3 text-xs">
                        <div className="space-y-1.5 border-b border-border pb-2 mb-2">
                            <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" /> <span>Approved</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" /> <span>Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" /> <span>Rejected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-500" /> <span>Draft</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Relations</p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-white/40 relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 border-t border-r border-white/60" />
                                </div>
                                <span>Hierarchy (child → parent)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-blue-500/40 border-t border-blue-400 relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 border-t border-r border-blue-400" />
                                </div>
                                <span>A Depends On B (A → B)</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 flex gap-2">
                        <div className="p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            Drag to pan • Scroll to zoom • Click node to focus
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

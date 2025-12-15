import React from 'react'
import { IconZap, IconShield, IconCpu, IconGrid } from '../Icons'
import './index.css'

const BentoGrid: React.FC = () => {
    return (
        <div className="bento-container">
            <div className="bento-grid">
                {/* Large Main Feature Card */}
                <div className="bento-card bento-card-large">
                    <div className="bento-card-glow"></div>
                    <div className="bento-card-content">
                        <div className="bento-icon-box">
                            <IconCpu className="bento-icon" />
                        </div>
                        <div>
                            <h3 className="bento-title">Core Architecture</h3>
                            <p className="bento-description">
                                Built on next-generation principles. Our architecture ensures stability, scalability, and performance from day one.
                            </p>
                        </div>
                        <div className="bento-status">
                            <div className="bento-progress-bar">
                                <div className="bento-progress-fill"></div>
                            </div>
                            <p className="bento-status-text">System Status: Optimal</p>
                        </div>
                    </div>
                </div>

                {/* Tall Visual Card */}
                <div className="bento-card bento-card-tall">
                    <div className="bento-card-bg"></div>
                    <IconShield className="bento-icon-large bento-icon-emerald" />
                    <h3 className="bento-title-small">Secure by Design</h3>
                    <p className="bento-description-small">
                        Enterprise-grade security embedded in every layer.
                    </p>
                </div>

                {/* Speed Card */}
                <div className="bento-card bento-card-small">
                    <div className="bento-card-header">
                        <IconZap className="bento-icon-medium bento-icon-amber" />
                        <span className="bento-badge">FAST</span>
                    </div>
                    <div>
                        <h3 className="bento-title-small">Lightning</h3>
                        <p className="bento-description-small">Zero latency interactions.</p>
                    </div>
                </div>

                {/* Modular Card */}
                <div className="bento-card bento-card-small">
                    <div className="bento-card-header">
                        <IconGrid className="bento-icon-medium bento-icon-pink" />
                    </div>
                    <div>
                        <h3 className="bento-title-small">Modular</h3>
                        <p className="bento-description-small">Composable UI blocks.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BentoGrid

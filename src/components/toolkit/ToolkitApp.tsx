import { useEffect, useMemo, useRef, useState } from 'react';

type ToolId = 'guid' | 'base64';

type ToolDefinition = {
	id: ToolId;
	name: string;
	description: string;
	symbol: string;
};

type ToastMessage = {
	id: number;
	text: string;
};

type Ripple = {
	id: number;
	x: number;
	y: number;
};

const TOOL_DEFINITIONS: ToolDefinition[] = [
	{
		id: 'guid',
		name: 'GUID Generator',
		description: 'Generate UUID v4 values instantly.',
		symbol: '◎'
	},
	{
		id: 'base64',
		name: 'Base64 Converter',
		description: 'Convert text or files into Base64.',
		symbol: '⇄'
	}
];

/**
 * Encodes UTF-8 text into a Base64 string.
 */
const encodeTextToBase64 = (inputText: string): string => {
	const encodedBytes = new TextEncoder().encode(inputText);
	const binaryString = Array.from(encodedBytes, (byteValue) => String.fromCharCode(byteValue)).join('');
	return btoa(binaryString);
};

/**
 * Reads a file and returns a Base64 representation.
 */
const encodeFileToBase64 = async (inputFile: File): Promise<string> => {
	const fileBuffer = await inputFile.arrayBuffer();
	const fileBytes = new Uint8Array(fileBuffer);
	const binaryString = Array.from(fileBytes, (byteValue) => String.fromCharCode(byteValue)).join('');
	return btoa(binaryString);
};

/**
 * Returns a cryptographically secure UUID v4 string.
 */
const createGuid = (): string => crypto.randomUUID();

/**
 * Renders the copy button with confirmation animation.
 */
const CopyButton = ({
	onCopy,
	label
}: {
	onCopy: () => Promise<void>;
	label: string;
}) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		await onCopy();
		setIsCopied(true);
		window.setTimeout(() => setIsCopied(false), 1200);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`copy-button ${isCopied ? 'is-copied' : ''}`}
		>
			<span className="copy-button-icon" aria-hidden="true">
				{isCopied ? '✓' : '⧉'}
			</span>
			{label}
		</button>
	);
};

/**
 * Renders a search input with typing pulse and focus glow effects.
 */
const ToolSearch = ({
	value,
	onChange,
	isTyping
}: {
	value: string;
	onChange: (value: string) => void;
	isTyping: boolean;
}) => (
	<label className="search-wrap">
		<span className="search-icon" aria-hidden="true">
			⌕
		</span>
		<input
			type="search"
			placeholder="Search tools"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			className={`search-input ${isTyping ? 'is-typing' : ''}`}
		/>
	</label>
);

/**
 * Renders a sidebar tool button with ripple interaction.
 */
const ToolButton = ({
	toolDefinition,
	isActive,
	onSelect
}: {
	toolDefinition: ToolDefinition;
	isActive: boolean;
	onSelect: (toolId: ToolId) => void;
}) => {
	const [ripples, setRipples] = useState<Ripple[]>([]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const targetRect = event.currentTarget.getBoundingClientRect();
		const nextRipple = {
			id: Date.now(),
			x: event.clientX - targetRect.left,
			y: event.clientY - targetRect.top
		};

		setRipples((previousRipples) => [...previousRipples, nextRipple]);
		window.setTimeout(() => {
			setRipples((previousRipples) =>
				previousRipples.filter((existingRipple) => existingRipple.id !== nextRipple.id)
			);
		}, 450);

		onSelect(toolDefinition.id);
	};

	return (
		<button type="button" onClick={handleClick} className={`tool-item ${isActive ? 'is-active' : ''}`}>
			{ripples.map((ripple) => (
				<span
					key={ripple.id}
					className="tool-ripple"
					style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
				/>
			))}
			<span className="tool-symbol" aria-hidden="true">
				{toolDefinition.symbol}
			</span>
			<span className="tool-label">{toolDefinition.name}</span>
		</button>
	);
};

/**
 * Renders the GUID tool content.
 */
const GuidTool = ({ showToast }: { showToast: (text: string) => void }) => {
	const [guidCount, setGuidCount] = useState(1);
	const [guids, setGuids] = useState<string[]>([]);

	const generateGuids = () => {
		const nextGuids = Array.from({ length: guidCount }, () => createGuid());
		setGuids(nextGuids);
	};

	const copyAll = async () => {
		if (guids.length === 0) {
			return;
		}
		await navigator.clipboard.writeText(guids.join('\n'));
		showToast('GUID output copied');
	};

	return (
		<div className="tool-body">
			<div className="tool-grid">
				<label className="field-wrap">
					<span className="field-label">GUID count</span>
					<input
						type="number"
						value={guidCount}
						min={1}
						max={50}
						onChange={(event) => {
							const parsedValue = Number(event.target.value || 1);
							setGuidCount(Math.max(1, Math.min(50, parsedValue)));
						}}
						className="field-input"
					/>
				</label>
				<button type="button" onClick={generateGuids} className="primary-button">
					Generate
				</button>
			</div>
			<section className={`result-panel ${guids.length > 0 ? 'is-visible' : ''}`}>
				<header className="result-header">
					<h3>Output</h3>
					<CopyButton onCopy={copyAll} label="Copy" />
				</header>
				<textarea readOnly className="result-textarea" value={guids.join('\n')} />
			</section>
		</div>
	);
};

/**
 * Renders the Base64 converter tool content.
 */
const Base64Tool = ({ showToast }: { showToast: (text: string) => void }) => {
	const [rawText, setRawText] = useState('');
	const [base64Result, setBase64Result] = useState('');
	const [selectedFileName, setSelectedFileName] = useState('');

	const convertText = () => {
		if (!rawText.trim()) {
			setBase64Result('');
			return;
		}
		setBase64Result(encodeTextToBase64(rawText));
	};

	const onFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) {
			return;
		}

		const encodedContent = await encodeFileToBase64(selectedFile);
		setBase64Result(encodedContent);
		setSelectedFileName(selectedFile.name);
	};

	const copyAll = async () => {
		if (!base64Result) {
			return;
		}
		await navigator.clipboard.writeText(base64Result);
		showToast('Base64 output copied');
	};

	return (
		<div className="tool-body">
			<div className="tool-grid">
				<label className="field-wrap field-grow">
					<span className="field-label">Text input</span>
					<textarea
						value={rawText}
						onChange={(event) => setRawText(event.target.value)}
						placeholder="Paste text to encode"
						className="field-textarea"
					/>
				</label>
				<div className="field-stack">
					<button type="button" onClick={convertText} className="primary-button">
						Convert text
					</button>
					<label className="file-button">
						Upload file
						<input type="file" onChange={onFileSelection} />
					</label>
					{selectedFileName ? (
						<p className="file-name" title={selectedFileName}>
							{selectedFileName}
						</p>
					) : null}
				</div>
			</div>
			<section className={`result-panel ${base64Result ? 'is-visible' : ''}`}>
				<header className="result-header">
					<h3>Base64</h3>
					<CopyButton onCopy={copyAll} label="Copy" />
				</header>
				<textarea readOnly className="result-textarea" value={base64Result} />
			</section>
		</div>
	);
};

/**
 * Renders a simple toast list for transient feedback.
 */
const ToastStack = ({
	messages
}: {
	messages: ToastMessage[];
}) => (
	<div className="toast-wrap" aria-live="polite">
		{messages.map((message) => (
			<div key={message.id} className="toast-message">
				{message.text}
			</div>
		))}
	</div>
);

/**
 * Main application component for the DEV Toolkit interface.
 */
const ToolkitApp = () => {
	const [activeToolId, setActiveToolId] = useState<ToolId>('guid');
	const [searchQuery, setSearchQuery] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [isLoadingPanel, setIsLoadingPanel] = useState(false);
	const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
	const [scrollProgress, setScrollProgress] = useState(0);
	const contentRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!searchQuery) {
			setIsTyping(false);
			return;
		}

		setIsTyping(true);
		const typingTimer = window.setTimeout(() => setIsTyping(false), 500);
		return () => window.clearTimeout(typingTimer);
	}, [searchQuery]);

	const filteredTools = useMemo(
		() =>
			TOOL_DEFINITIONS.filter((toolDefinition) => {
				const normalizedQuery = searchQuery.trim().toLowerCase();
				if (!normalizedQuery) {
					return true;
				}

				return (
					toolDefinition.name.toLowerCase().includes(normalizedQuery) ||
					toolDefinition.description.toLowerCase().includes(normalizedQuery)
				);
			}),
		[searchQuery]
	);

	useEffect(() => {
		if (filteredTools.length === 0) {
			return;
		}

		if (!filteredTools.find((toolDefinition) => toolDefinition.id === activeToolId)) {
			setActiveToolId(filteredTools[0].id);
		}
	}, [activeToolId, filteredTools]);

	const showToast = (text: string) => {
		const nextMessage = { id: Date.now(), text };
		setToastMessages((previousMessages) => [...previousMessages, nextMessage]);

		window.setTimeout(() => {
			setToastMessages((previousMessages) =>
				previousMessages.filter((existingMessage) => existingMessage.id !== nextMessage.id)
			);
		}, 2000);
	};

	const switchTool = (toolId: ToolId) => {
		if (toolId === activeToolId) {
			return;
		}

		setIsLoadingPanel(true);
		window.setTimeout(() => {
			setActiveToolId(toolId);
			setIsLoadingPanel(false);
		}, 300);
	};

	const activeTool = TOOL_DEFINITIONS.find((toolDefinition) => toolDefinition.id === activeToolId);
	const activeToolIndex = filteredTools.findIndex((toolDefinition) => toolDefinition.id === activeToolId);

	useEffect(() => {
		const contentNode = contentRef.current;
		if (!contentNode) {
			return;
		}

		const updateScrollProgress = () => {
			const scrollableHeight = contentNode.scrollHeight - contentNode.clientHeight;
			if (scrollableHeight <= 0) {
				setScrollProgress(0);
				return;
			}

			setScrollProgress((contentNode.scrollTop / scrollableHeight) * 100);
		};

		updateScrollProgress();
		contentNode.addEventListener('scroll', updateScrollProgress);

		return () => contentNode.removeEventListener('scroll', updateScrollProgress);
	}, []);

	return (
		<div className="toolkit-page">
			<div className="toolkit-shell">
				<aside className="toolkit-sidebar">
					<header className="sidebar-header">
						<h1>DEV Toolkit</h1>
						<p>Fast utilities for daily web workflows.</p>
					</header>
					<ToolSearch value={searchQuery} onChange={setSearchQuery} isTyping={isTyping} />
					<nav className="tool-list" aria-label="Tool list">
						{activeToolIndex >= 0 ? (
							<div
								className="tool-active-indicator"
								style={{ transform: `translateY(${activeToolIndex * 64}px)` }}
							/>
						) : null}
						{filteredTools.map((toolDefinition) => (
							<ToolButton
								key={toolDefinition.id}
								toolDefinition={toolDefinition}
								isActive={toolDefinition.id === activeToolId}
								onSelect={switchTool}
							/>
						))}
					</nav>
				</aside>
				<section className="toolkit-content" ref={contentRef}>
					<div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
					<div className="ambient-gradient" aria-hidden="true" />
					<header className="content-header">
						<div>
							<h2>{activeTool?.name ?? 'No tools found'}</h2>
							<p>{activeTool?.description ?? 'Adjust search to display available tools.'}</p>
						</div>
					</header>
					{isLoadingPanel ? (
						<div className="tool-skeleton" aria-hidden="true">
							<div className="skeleton-line large" />
							<div className="skeleton-line" />
							<div className="skeleton-block" />
						</div>
					) : activeToolId === 'guid' ? (
						<GuidTool showToast={showToast} />
					) : activeToolId === 'base64' ? (
						<Base64Tool showToast={showToast} />
					) : null}
				</section>
			</div>
			<ToastStack messages={toastMessages} />
		</div>
	);
};

export default ToolkitApp;

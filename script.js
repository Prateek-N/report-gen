// Shared function to populate the preview data
function populatePreview() {
    // 1. Gather Data & Populate Preview
    const mapping = {
        'candidateName': 'outCandidateName',
        'candidateId': 'outCandidateId',
        'roleTrack': 'outRoleTrack',
        'expertOwner': 'outExpertOwner',
        'reportDate': 'outDate',
        'summaryRecent': 'outSummaryRecent',
        'summaryConcern': 'outSummaryConcern',
        'summaryToday': 'outSummaryToday',
        'summaryNext': 'outSummaryNext',
        'obsComm': 'outObsComm',
        'obsBasics': 'outObsBasics',
        'obsProblem': 'outObsProblem',
        'obsPatterns': 'outObsPatterns',
        'provMockTime': 'outProvMockTime',
        'provFeedback': 'outProvFeedback',
        'provDocs': 'outProvDocs',
        'provNextMock': 'outProvNextMock',
        'planCandidate': 'outPlanCandidate',
        'planExpert': 'outPlanExpert',
        'planUpdate': 'outPlanUpdate'
    };

    // Helper to set text content safely
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '-';
    };

    for (const [inputId, outputId] of Object.entries(mapping)) {
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            setText(outputId, inputEl.value);
        } else {
            console.warn(`Input element not found: ${inputId}`);
        }
    }

    // Special handling for Gaps (List Items)
    const gaps = ['gap1', 'gap2', 'gap3'];
    gaps.forEach(gap => {
        const val = document.getElementById(gap).value;
        const outId = 'out' + gap.charAt(0).toUpperCase() + gap.slice(1);
        const el = document.getElementById(outId);
        if (el) {
            el.textContent = val;
            el.style.display = val ? 'list-item' : 'none';
        }
    });

    // Subject Line Logic
    const name = document.getElementById('candidateName').value || 'Candidate';
    const concern = document.getElementById('summaryConcern').value;
    const subjectConcern = concern ? (concern.length > 30 ? concern.substring(0, 30) + '...' : concern) : 'Status Update';
    
    setText('outSubjectName', name);
    setText('outSubjectConcern', subjectConcern);
    
    return name;
}

document.getElementById('generateBtn').addEventListener('click', function() {
    const name = populatePreview();
    const element = document.getElementById('reportPreview');
    
    // TEMPORARY VISIBILITY FOR PDF GEN
    // We modify the original element instead of cloning to ensure consistency
    // Save original styles to restore later
    const originalDisplay = element.style.display;
    
    // Make it visible and white-paper styled
    element.style.display = 'block';
    element.style.background = '#ffffff';
    element.style.color = '#333333';
    // Ensure it's on top or at least visible to html2canvas
    // Note: We are NOT hiding it off-screen with negative left, 
    // as that can sometimes cause blank PDFs with certain scroll states.
    // Instead we just let it appear at the bottom for a split second.
    
    // 3. Generate PDF
    const opt = {
        margin:       0.5,
        filename:     `Mock_Report_${name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Small timeout to ensure DOM render
    setTimeout(() => {
        html2pdf().set(opt).from(element).save().then(() => {
            // 4. Restore hidden state
            element.style.display = 'none';
        }).catch(err => {
            console.error("PDF generation failed:", err);
            alert("Error generating PDF. Please check console.");
            element.style.display = 'none';
        });
    }, 100);
});

// FILL DUMMY DATA
document.getElementById('fillDummyBtn').addEventListener('click', function() {
    document.getElementById('candidateName').value = "John Doe";
    document.getElementById('candidateId').value = "CAND-12345";
    document.getElementById('roleTrack').value = "Frontend Engineer";
    document.getElementById('expertOwner').value = "Jane Smith";
    document.getElementById('reportDate').value = new Date().toISOString().slice(0, 10);
    
    document.getElementById('summaryRecent').value = "Candidate struggled with basic closure concepts in the last session.";
    document.getElementById('summaryConcern').value = "Weak fundamentals in JavaScript.";
    document.getElementById('summaryToday').value = "Conducted a deep dive on scope and closures.";
    document.getElementById('summaryNext').value = "Need to verify understanding of async/await.";
    
    document.getElementById('obsComm').value = "Communication is clear but hesitant when unsure.";
    document.getElementById('obsBasics').value = "Struggles with event loop and hoisting.";
    document.getElementById('obsProblem').value = "Able to solve easy algo problems but code structure is messy.";
    document.getElementById('obsPatterns').value = "Tendency to guess answers rather than reason through them.";
    
    document.getElementById('gap1').value = "Understanding of Closures";
    document.getElementById('gap2').value = "Async Programming (Promises)";
    document.getElementById('gap3').value = "Code Modularity";
    
    document.getElementById('provMockTime').value = new Date().toISOString().slice(0, 16);
    document.getElementById('provFeedback').value = "Yes";
    document.getElementById('provDocs').value = "Shared MDN links and custom exercises.";
    document.getElementById('provNextMock').value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    document.getElementById('planCandidate').value = "1. Read 'You Don't Know JS' ch 1-3.\n2. Complete 5 LeetCode medium problems.";
    document.getElementById('planExpert').value = "Review code submissions and hold a 30min Q&A.";
    document.getElementById('planUpdate').value = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
});

// PREVIEW HTML
document.getElementById('previewBtn').addEventListener('click', function() {
    populatePreview();
    const element = document.getElementById('reportPreview');
    
    if (element.style.display === 'none') {
        element.style.display = 'block';
        element.style.background = '#ffffff';
        element.style.color = '#333333';
        this.textContent = "Hide Preview";
        // Scroll to preview
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        element.style.display = 'none';
        this.textContent = "Preview HTML";
    }
});
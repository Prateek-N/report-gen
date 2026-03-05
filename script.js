document.getElementById('generateBtn').addEventListener('click', function() {
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
            // Hide list item if empty? Or keep as bullet?
            // User requirement: "Gaps (clear bullets)"
            el.style.display = val ? 'list-item' : 'none';
        }
    });

    // Subject Line Logic
    // [MOCK REPORT] <Candidate Name> | <Main Concern/Status>
    const name = document.getElementById('candidateName').value || 'Candidate';
    const concern = document.getElementById('summaryConcern').value;
    // Truncate concern for subject if too long, or just use a generic "Review" if empty
    const subjectConcern = concern ? (concern.length > 30 ? concern.substring(0, 30) + '...' : concern) : 'Status Update';
    
    setText('outSubjectName', name);
    setText('outSubjectConcern', subjectConcern);


    // 2. Prepare for PDF Generation
    const element = document.getElementById('reportPreview');
    
    // Show the element temporarily for rendering
    element.style.display = 'block';

    // 3. Generate PDF
    const opt = {
        margin:       0.5,
        filename:     `Mock_Report_${name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // 4. Hide after generation
        element.style.display = 'none';
    }).catch(err => {
        console.error("PDF generation failed:", err);
        alert("Error generating PDF. Please check console.");
        element.style.display = 'none'; // Ensure it's hidden on error too
    });
});

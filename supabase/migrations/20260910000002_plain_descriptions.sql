-- Plain-English product descriptions.
--
-- Same facts, same caveats, same regulatory statements as before — only the
-- jargon is gone. Deliberately no trial efficacy outcomes: what a compound
-- achieved in a trial is a therapeutic claim, and one stated next to a price
-- is what turns a research chemical into an unlicensed medicine by
-- presentation. Trial *status* ("development discontinued in 2007", "no
-- marketing authorisation") is factual background and is kept.
update products set description = 'A fragment of human growth hormone — the stretch covering amino acids 176-191, with one extra amino acid added to the front. In animal studies it acts on the pathways fat cells use to break down stored fat, without a measurable effect on blood sugar handling or IGF-1, which is what makes it useful for separating growth hormone''s metabolic activity from its growth activity. Clinical development was discontinued in 2007 and it holds no marketing authorisation.' where slug = 'aod-9604';

update products set description = 'A synthetic six-amino-acid peptide shaped to imitate part of SNAP-25, a protein nerve cells use to release their signalling chemicals. In lab conditions it competes with the real protein and slows that release. The applied evidence is mixed: manufacturer-sponsored studies report measurable effects, while at least one independent evaluation found none. Used as a cosmetic formulation ingredient.' where slug = 'argireline-acetyl-hexapeptide-8';

update products set description = 'A synthetic chain of 15 amino acids based on a sequence found in a protein in gastric juice. In rodent studies it has been reported to influence blood vessel formation, collagen deposition, cell migration and nitric oxide signalling across several tissue types. The published work is almost entirely preclinical, with very limited human data. Not authorised as a medicine in any jurisdiction.' where slug = 'bpc-157';

update products set description = 'A long-acting synthetic version of amylin, a hormone released alongside insulin. It binds the amylin and calcitonin receptors; substitutions in its structure stop it clumping into fibres, and an attached fatty-acid chain lets it bind blood proteins so it lasts longer. Used in research on amylin receptor pharmacology, a pathway separate from the incretin signalling that GLP-1 compounds act on.' where slug = 'cagrilintide';

update products set description = 'Not a single synthetic peptide but a standardised mixture of small neuropeptides and free amino acids, produced by enzymatically breaking down porcine brain tissue — roughly 25% peptides under 10 kDa and 75% free amino acids. In preclinical models it has been reported to alter the expression of several nerve growth factors. Because it is animal-tissue-derived it falls under separate biological-material handling and import rules from the synthetic peptides in this catalogue. Holds marketing authorisation as a medicine in a number of jurisdictions.' where slug = 'cerebrolysin';

update products set description = 'A 29-amino-acid version of growth hormone-releasing hormone, altered at four positions so that the enzyme which normally breaks it down cannot. It binds the same receptor as the natural hormone. The DAC variant carries an additional chemical group that locks onto a blood protein, extending how long it stays in circulation to roughly eight days.' where slug = 'cjc-1295';

update products set description = 'A modified two-amino-acid compound derived from angiotensin IV. In cell culture it strengthens the effect of hepatocyte growth factor at its receptor, working at extremely low concentrations. Studied for effects on the formation of connections between nerve cells. The literature covers cell culture and rodents only.' where slug = 'dihexa';

update products set description = 'A synthetic four-amino-acid peptide (Ala-Glu-Asp-Gly) that came out of research on pineal gland peptides. Studied for reported effects on telomerase — the enzyme maintaining the protective caps on chromosomes — alongside changes in melatonin production and body-clock gene activity. Most of the primary literature originates from a single research group, and independent replication remains limited.' where slug = 'epitalon';

update products set description = 'A naturally occurring three-amino-acid peptide (glycine, histidine, lysine) bound to copper. Studied in cell culture for effects on the genes controlling the scaffolding between cells, on the balance of enzymes that break that scaffolding down, and on copper-dependent signalling. Also used as an ingredient in cosmetic formulation research.' where slug = 'ghk-cu';

update products set description = 'A synthetic peptide that switches on the ghrelin receptor — the same receptor the body''s hunger hormone uses — which in turn triggers growth hormone release. Reported in the literature as more potent at that receptor than GHRP-6, with a different pattern of off-target activity on other pituitary cell types.' where slug = 'ghrp-2';

update products set description = 'The original synthetic growth hormone-releasing hexapeptide, acting on the ghrelin receptor. Because it shares ghrelin''s receptor it also engages the appetite and stress-hormone pathways tied to that receptor — a property later compounds in this class were designed to reduce.' where slug = 'ghrp-6';

update products set description = 'A 24-amino-acid peptide encoded inside mitochondrial DNA rather than in the cell nucleus, and the first of this class to be described. It interacts with several proteins involved in cell survival signalling, and in lab conditions also shows a chaperone-like effect that helps prevent another peptide misfolding. A reference compound in mitochondrial signalling and cytoprotection research.' where slug = 'humanin';

update products set description = 'A five-amino-acid growth hormone secretagogue that selectively switches on the ghrelin receptor. Characterised in the literature as more receptor-selective than earlier secretagogues, with comparatively little effect on the pituitary cells producing stress hormones and prolactin in the models studied. Clinical development ended without authorisation.' where slug = 'ipamorelin';

update products set description = 'A neuropeptide that binds the KISS1R receptor found on the nerve cells which control reproductive hormone release. Binding sets off a calcium-based signalling cascade inside the cell. It sits near the top of the chain regulating the reproductive hormone axis, making it a standard tool in reproductive neuroendocrinology research.' where slug = 'kisspeptin';

update products set description = 'A three-amino-acid fragment (lysine, proline, valine) taken from the tail end of alpha-melanocyte-stimulating hormone. In lab conditions it retains the parent peptide''s anti-inflammatory activity without the pigmentation effects, largely by blocking a key inflammatory signalling protein from entering the cell nucleus. It is carried by a transporter that becomes more abundant in inflamed intestinal lining. Preclinical literature only.' where slug = 'kpv';

update products set description = 'An eight-amino-acid peptide that blocks zonulin signalling at the intestinal lining, preventing the junctions between cells from loosening and inhibiting the pathway that drives leakage between them. A standard reference compound in intestinal barrier function research. Investigational, with no marketing authorisation.' where slug = 'larazotide';

update products set description = 'A five-amino-acid peptide with a fatty acid attached, built on a fragment released when the body processes collagen. In fibroblast culture it acts as a feedback signal on collagen and elastin gene activity; the fatty-acid chain helps it partition into cell membranes. A cosmetic formulation ingredient, widely used in dermatological research.' where slug = 'matrixyl-palmitoyl-pentapeptide-4';

update products set description = 'A 16-amino-acid peptide encoded within mitochondrial DNA. It works through a folate-related pathway that causes a metabolic intermediate to accumulate, which in turn activates AMPK — a central energy-sensing enzyme in the cell. Studied in metabolic and mitochondrial signalling research.' where slug = 'mots-c';

update products set description = 'A ring-shaped seven-amino-acid peptide that activates melanocortin receptors in the brain, a different route from the peripheral blood-flow pathway that PDE5 inhibitors act on. Holds marketing authorisation as a medicine in some jurisdictions.' where slug = 'pt-141-bremelanotide';

update products set description = 'A synthetic 26-amino-acid peptide that acts on three receptors at once — GLP-1, GIP and glucagon. The glucagon component is what separates it from dual-receptor compounds; in preclinical models it is associated with changes in how the liver handles fat and how the body selects fuel. Not authorised as a medicine in any jurisdiction; supplied as a research chemical.' where slug = 'retatrutide';

update products set description = 'A synthetic seven-amino-acid version of tuftsin, a peptide the body produces naturally. In preclinical models it is reported to work through three converging routes: modulating GABA-A receptors, increasing BDNF in hippocampal tissue, and slowing the breakdown of enkephalins. One of the more extensively studied compounds in the anxiolytic neuropeptide literature.' where slug = 'selank';

update products set description = 'A peptide that activates the GLP-1 receptor, mimicking a gut hormone released after eating. It increases insulin release when blood sugar is high, suppresses glucagon, and slows stomach emptying, with additional activity in appetite-regulating regions of the brain. An attached fatty-acid chain binds it to blood proteins, extending its half-life to roughly one week. Widely characterised in the incretin literature.' where slug = 'semaglutide';

update products set description = 'A synthetic seven-amino-acid peptide based on a fragment of ACTH, with an added tail that resists enzyme breakdown. Reported to increase BDNF production and its receptor signalling in hippocampal tissue, with several downstream pathways activated. Extensively characterised in the Russian neuropeptide literature.' where slug = 'semax';

update products set description = 'The first 29 amino acids of growth hormone-releasing hormone — the shortest piece that still fully activates the receptor. It binds the same receptor as the natural hormone and signals through the cAMP pathway. Historically authorised as a diagnostic and therapeutic agent under the name Geref, since discontinued.' where slug = 'sermorelin';

update products set description = 'The synthetic active fragment of thymosin beta-4, a protein that binds actin and regulates how cells build their internal scaffolding and move. Preclinical work associates it with skin and blood vessel cell migration and progenitor cell recruitment. Note that most published human data concerns the full-length recombinant protein rather than this shorter fragment.' where slug = 'tb-500-thymosin-beta-4';

update products set description = 'A stabilised version of growth hormone-releasing hormone carrying a chemical group at one end that resists enzymatic degradation. It binds the growth hormone-releasing hormone receptor and drives the growth hormone / IGF-1 axis. Holds marketing authorisation as a medicine in some jurisdictions.' where slug = 'tesamorelin';

update products set description = 'A peptide that activates two incretin receptors at once, GIP and GLP-1. At the GLP-1 receptor it favours one signalling route over another — a property described in the literature as biased signalling. Studied as a reference compound for comparing single- versus dual-incretin receptor pharmacology in vitro.' where slug = 'tirzepatide';

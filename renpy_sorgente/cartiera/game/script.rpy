
### PERSONAGGI

#  Per prima cosa devi associare il nome di una famiglia di immagini al personaggio. Quando scrivi "e" Ren'py andrà a cercare tra le foto il cui nome comincia con "elena".
define ric = Character("Riccardo", color="#f44", image="riccardo")
define mar = Character("Maira", color="#09e840", image="maira")

### IMMAGINI
## Riccardo
image riccardo = "riccardo.png"
image riccardo ascolta = "riccardo ascolta.png"
image riccardo domanda = "riccardo domanda.png"
image riccardo arrabbiato = "riccardo arrabbiato.png"
image riccardo segreto = "riccardo segreto.png"
image riccardo punta = "riccardo punta.png"
image riccardo ride = "riccardo ride.png"
image riccardo sorpreso = "riccardo sorpreso.png"
image riccardo preciso = "riccardo preciso.png"
image riccardo saluta = "riccardo saluta.png" # TO DO: CAMBIARE IMMAGINE
## Maira
image maira = "maira.png"
image maira ascolta = "maira ascolta.png"
image maira saluta = "maira saluta.png" # TO DO: CAMBIARE IMMAGINE
image maira domanda = "maira domanda.png"
image maira arrabbiata = "maira arrabiata.png"
image maira segreto = "maira segreto.png"
image maira punta = "maira punta.png"
image maira ride = "maira ride.png"
image maira sorpresa = "maira sorpresa.png"
image maira precisa = "maira precisa.png"

## THUMBNAILS
## Riccardo
image side riccardo parla = "side_riccardo_parla.png"
image side riccardo ride = "side_riccardo_ride.png"
image side riccardo domanda = "side_riccardo_domanda.png"
image side riccardo sorpreso = "side_riccardo_sorpreso.png"
image side riccardo segreto = "side_riccardo_segreto.png"
image side riccardo punta = "side_riccardo_punta.png"
image side riccardo arrabbiato = "side_riccardo_arrabbiato.png"

## Maira
image side maira parla ="side_maira_parla.png"
image side maira ride ="side_maira_ride.png"
image side maira domanda ="side_maira_domanda.png"
image side maira sorpresa ="side_maira_sorpresa.png"
image side maira segreto ="side_maira_segreto.png"
image side maira punta ="side_maira_punta.png"
image side maira precisa ="side_maira_precisa.png"
image side maira arrabbiata ="side_maira_arrabbiata.png"

## CONSTANTS
## Left character
define riccardo_xpos = -0.25
define riccardo_ypos = -0.10
define riccardo_zoom = 2.30
## Right character
define maira_xpos = -0.17
define maira_ypos = -0.00
define maira_zoom = 2.20






label start:

    #########################################
    ## SECTION: Intro              ##########
    #########################################

    
    scene bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54 


    # Leonardo is the rightmost character
    show riccardo onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    # Elena is the leftmost character

    ric "Benvenuti nella Cartiera di Mastro Cecco!"

    show riccardo ascolta onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    mar "Qui apprenderemo le complesse fasi che portavano alla produzione della carta bambagina. Pronti?"

    #########################################
    ## SECTION: Menu               ##########
    #########################################

    menu content:

        mar "Cosa vuoi sapere?"

        "Storia":
            hide maira onlayer leftmostcharacter
            hide riccardo onlayer rightmostcharacter
            jump storia
        
        "Strumenti":
            jump strumenti 

        "Maestri":
            jump maestri

        "Ok, grazie. Non ho altre curiosità.":
            jump congedo


    #########################################
    ## SECTION: Storia carta  ##########
    #########################################

label storia:
    scene bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54 

    ric parla "Prima di parlare di come veniva prodotta la carta, è meglio fare una breve digressione.Parliamo di storia!"
    mar parla "Vi siete mai chiesti dove e come nasce la produzione della carta? Ve lo diciamo noi!"


    show bg risma:
        subpixel True pos (-0.03, -0.07) zoom 1.78 

    mar parla "La carta venne inventata in Cina nel 105 d.C."

    mar precisa "Ma entrò in commercio solo quattrocento anni dopo."

    mar parla "In Persia e nell'Occidente medievale si userà il papiro e la pergamena fino al XIII secolo."

    show bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54 


    show riccardo sorpreso onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    ric "Quindi la carta è stata inventata in Cina migliaia di anni fa!"

    show maira segreto onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    mar "E ovviamente, con la sua scoperta nasce la leggenda..."


    show bg lun:
        subpixel True ypos -0.64 zoom 1.88 
    with dissolve

    hide maira onlayer leftmostcharacter
    hide riccardo onlayer rightmostcharacter

    mar precisa "Secondo la leggenda Ts'ai Lun si trovava in riva al fiume dove una donna lavava gli stracci."
    mar parla "Ts'ai Lun prese le fibre accumulate e le mise ad asciugare."

    show bg cartacinese:
        subpixel True ypos -0.64 zoom 0.60 

    mar sorpresa "Ne venne fuori un foglio bianco, perfetto per scrivere!"

    show bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54 
    with dissolve

    hide maira 
    hide riccardo 

    show riccardo domanda onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    ric "E prima di questa invenzione con cosa veniva prodotta la carta?"

    show maira punta onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    mar "Ora te lo spiego!"


    show bg gelso:
        subpixel True pos (-0.0, -0.24) zoom 1.51 
    with dissolve

    hide maira onlayer leftmostcharacter
    hide riccardo onlayer rightmostcharacter

    mar parla "Originariamente la carta era prodotta dal gelso."
    mar "In seguito si utilizzò il bambù e poi canapa, lino e cenci. La formula definitiva di tutti i cartai."
    ric punta "Adesso però voglio sapere come lavoravano la carta i cinesi!"

    show bg lavorocarta:
        subpixel True pos (-0.0, -0.39) zoom 1.9 
    with dissolve

    mar precisa "In Cina si creava la carta a partire dalle fibre vegetali. Queste venivano bagnate, pressate e infine asciugate in fogli, su tavole di legno."
    mar parla "I cinesi custodirono gelosamente la loro ricetta per fare la carta, che li aveva resi famosi in tutto il mondo."
    ric domanda "E ci riuscirono?"
    mar parla "Fino alla battaglia di Talas sì..."

    show bg battaglia:
        subpixel True pos (0.0, -0.39) zoom 1.9 
    with dissolve

    mar sorpresa "Nel 751 d.C l'Islam entra in guerra contro la Cina."
    mar "Nella sanguinosa battaglia che si tenne sul fiume Talas, vinsero gli arabi."
    ric domanda "E che c'entra questo con la carta?"
    mar precisa "Tra i molti prigionieri fatti, c'erano anche alcuni maestri cartai cinesi... "
    mar "Fu così che, nel giro di poco tempo, la carta si diffuse in Occidente e in Europa."
    ric sorpreso "Ah! Quindi è così che in Europa si inizia a produrre la carta..."

    show bg cartieraaraba:
        subpixel True pos (0.0, -0.02) zoom 2.59 
    with dissolve

    mar parla "Si, dall'Africa l'arte della carta arriva in Spagna e in Sicilia."
    mar "La Spagna, dominata dagli arabi, apre la prima cartiera europea, a Xativa, Valencia."
    mar "Nel XIII secolo, sarà invece Palermo a diventare il più grande centro di produzione italiano."
    ric domanda "In Italia, se non sbaglio, fu una piccola città a diventare il centro di produzione più importante d'Europa...vero?"

    show bg areafabriano:
        subpixel True pos (0.0, 0.0) zoom 1.40 
    with dissolve

    mar parla "Esatto! A metà del XIII secolo, a Fabriano si scopre un metodo differente da quello arabo e cinese."
    mar precisa "La carta prodotta qui aveva una qualità superiore e costi più contenuti."
    mar parla "Così in poco tempo, diventa il più importante centro di produzione della carta."

    show bg diaspora:
        subpixel True ypos -0.19 zoom 4.09 
    with dissolve

    mar "Fabriano ebbe il merito di aver migliorato e apportato grandi innovazioni, rispetto al metodo cinese. Vediamole insieme!"

    show bg filigrana:
        subpixel True ypos -0.18 zoom 1.56 
    with dissolve

    mar "La prima è la fligrana, una scritta visibile solo in controluce."
    ric ride "Il primo marchio di fabbrica, anticontraffazione!"

    show bg collatura:
        subpixel True pos (-0.0, -0.71) zoom 1.91 
    with dissolve

    mar "La seconda è la collatura."
    mar "I maestri usavano la gelatina animale per incollare e impermeabilizzare il foglio."
    ric parla "Ora che è più resistente,la carta inizia ad essere usata per i documenti ufficiali."

    show bg fabrianopila:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    mar "la terza invenzione è la pila a magli multipli."
    mar "Una macchina a bracci multipli che serviva a disgrossare, raffinare e affiorare."

        ## End of this section 
    jump backtocontentmenu

    #########################################
    ## SECTION: Gli strumenti    ##########
    #########################################

label strumenti:

    scene bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54
    with dissolve

    show riccardo onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira ascolta onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    ric "All'interno della cartiera, c'erano tanti piccoli strumenti che servivano al cartaio per lavorare."

    show maira domanda onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    mar "Ad esempio?"

    show bg torchio:
        subpixel True pos (-0.03, -0.74) zoom 2.1 
    with dissolve

    hide maira onlayer leftmostcharacter
    hide riccardo onlayer rightmostcharacter

    ric parla "Ad esempio il torchio, che serviva a pressare la carta."

    show bg torchioumano:
        subpixel True pos (-0.03, -0.74) zoom 2.1 
    with dissolve

    ric parla "La macchina schiacciava la pila di fogli per togliere l'acqua in eccesso."
    ric parla "Poi Si procedeva al distaccamento del foglio."   
    mar punta "E quella laggiù che cos'è?"

    show bg fabrianopila:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric parla "Quella è la pila idraulica a magli multipli. È la prima macchina moderna della storia!"
    mar domanda "Come funzionava?"
    ric "Veniva azionata dall'acqua, che muoveva la ruota e poi i magli."
    ric "Il maglio pestava lo straccio e ne faceva una poltiglia."
    mar domanda "Come faceva a ridurlo in poltiglia?"

    show bg piladettaglio:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric "Grazie ai magli che avevano dei chiodi alle estremità."
    ric sorpreso "Varie tipologie di chiodi per ogni specificità: disgrossare, raffinare, affiorare."
    mar punta "Bene, abbiamo capito come veniva prodotta la carta!"
    ric "Non è finita qui! Manca un ultimo passo."
    mar domanda "E quale?"

    show bg bancocialandro:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric parla "La cialandratura! Serviva a eliminare le imperfezioni."
    mar domanda "E come si faceva la cialandratura?"



    window auto hide
    show bg bancocialandro:
        subpixel True 
        pos (-0.0, -0.28) zoom 1.53 
        linear 0.40 pos (-0.01, -1.29) zoom 3.37 
    with Pause(0.50)
    show bg bancocialandro:
        pos (-0.01, -1.29) zoom 3.37 

    show mascheracolori onlayer lights:
        subpixel True pos (-0.81, -0.64) zoom 1.81 
    with dissolve

    ric sorpreso "Con questa pietra levigata: il cialandro!"
    ric parla "La carta veniva lisciata e resa idonea per essere scritta."
    mar domanda "Cosa facevano con tutti quegli scarti di lavorazione?"

    show bg pizzastoc:
        subpixel True pos (-0.0, -0.04) zoom 1.57 
    with dissolve
    hide mascheracolori onlayer lights

    ric ride "Semplice, facevano la pizza!"
    mar sorpresa "Mmm... un po' stopposa, non trovi?"
    ric ride "Ma cosa hai capito? La pizza era la scorta di pisto raffinato, per i tempi di magra."
    ric parla "Veniva avvolto in un panno di canapa e spremuto al torchio."
    ric "Tolto il panno la pizza veniva stoccata in attesa di essere utilizzata."



    jump backtocontentmenu

    #########################################
    ## SECTION: I maestri  ##########
    #########################################

    label maestri:
        
 
    scene bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54
    with dissolve

    show riccardo ascolta onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    mar "Parliamo dei mestieri dietro alla produzione della carta."

    show riccardo domanda onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira ascolta onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    ric "Mestieri?"

    show maira punta onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    show riccardo ascolta onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    mar "Hai capito bene, per produrre la carta servivano diverse figure professionali."

    show riccardo domanda onlayer rightmostcharacter:
        xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira ascolta onlayer leftmostcharacter:
        xpos maira_xpos ypos maira_ypos zoom maira_zoom

    ric "Tipo?"

    show bg stracciarola:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    hide maira onlayer leftmostcharacter
    hide riccardo onlayer rightmostcharacter

    mar precisa "Tipo la stracciarola, colei che divideva i cenci in boni, grossi e vergati."

    show bg stracci:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    mar parla "Poi passava alla “scrollatura” (pulitura), “arcapatura” e “scieglitura“ dei tessuti."

    show bg mani:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    mar "Infine una volta divisi cotone, lino e canapa, i cenci erano tagliati e messi a macerare in acqua e calce."

    show bg stracciarola:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric sorpreso "Praticamente un lavoraccio!"
    mar precisa "Un lavoro fondamentale direi, perché alla base della filiera."
    ric domanda "E qual era la figura più importante di questa filiera?"

    show bg fogliopasta:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    mar parla "Il mastro cartaio!"

    show bg immerge:
        subpixel True pos (-0.0, -0.1) zoom 1.53 
    with dissolve

    mar parla "Colui che immergeva il setaccio di tela nel tino pieno di pasta da carta!"
    ric domanda "Qual era la sua abilità?"

    show bg su:
        subpixel True pos (-0.0, -0.1) zoom 1.53 
    with dissolve

    mar precisa "L'abilità stava nel coprire la tela con la stessa quantità di impasto."

    show bg ponitore:
        subpixel True pos (-0.15, -0.35) zoom 1.53 
    with dissolve

    mar parla "La forma, con il foglio appena formato, veniva passata al ponitore."

    show bg fogliopasta:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric domanda "Dopo il Mastro Cartaio, chi viene?"

    show bg bancocialandro:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    mar parla "L'ultimo passaggio era la cialandratura, con il cialandro."
    ric domanda "Cos'è il cialandro?"

    window auto hide
    show bg bancocialandro:
        subpixel True 
        pos (-0.0, -0.28) zoom 1.53 
        linear 0.40 pos (-0.01, -1.29) zoom 3.37 
    with Pause(0.50)
    show bg bancocialandro:
        pos (-0.01, -1.29) zoom 3.37 

    show mascheracolori onlayer lights:
        subpixel True pos (-0.81, -0.64) zoom 1.81 
    with dissolve

    mar precisa "Il cialandro è una pietra levigata che si sfregava sul foglio. "
    mar parla "Serviva a togliere le imperfezioni e le ruvidità, lucidarlo e renderlo adatto alla scrittura."

    hide mascheracolori onlayer lights

    show bg bancocialandro:
        subpixel True pos (-0.0, -0.28) zoom 1.53 
    with dissolve

    ric domanda "Bene! Ma poi come veniva venduta tutta questa carta?"

    show bg asciugatura:
        subpixel True pos (-0.0, 0.0) zoom 1.53 
    with dissolve    

    mar parla "I fogli venivano stesi ad asciugare."

    show bg risme:
        subpixel True pos (-0.0, -0.34) zoom 1.53 
    with dissolve  

    mar "Poi impilati in risme e infine venduti."    

        ## End of this section 
    jump backtocontentmenu

    #########################################
    ## SECTION: La doratura  ##########
    #########################################

    label doratura:

        show bg bottega

        show leonardo onlayer rightmostcharacter:
            xpos leonardo_xpos ypos leonardo_ypos zoom leonardo_zoom

        show elena ascolta onlayer leftmostcharacter:
            xpos elena_xpos ypos elena_ypos zoom elena_zoom

        ele "L'oro tutto impreziosiva!"   


        show bg bottega

        show leonardo onlayer rightmostcharacter:
            xpos leonardo_xpos ypos leonardo_ypos zoom leonardo_zoom

        show elena ascolta onlayer leftmostcharacter:
            xpos elena_xpos ypos elena_ypos zoom elena_zoom

        ele "Era molto scenografico e, dato il suo valore, aveva anche un significato preciso!" 

        show bg doro
        with dissolve   

        hide elena onlayer leftmostcharacter
        hide leonardo onlayer rightmostcharacter

        leo domanda "Tutto chiaro, ma come facevano a produrre la foglia d'oro?"

        ele parla "Ora te lo spiego!"


        show bg battirolo
        with dissolve

        ele parla "Per trasformare l'oro in una lamina sottile, c'era bisogno di pazienza, forza e maestria."
        ele sorride  "Chi aveva queste doti, aveva un lavoro certo: quello del Battiloro, artigiano specializzato nella creazione delle foglie d'oro."  
        ele "Il lavoro consisteva nel battere una pepita d'oro tra due pelli di animale, con un enorme martello fino a ridurla a una lamina sottile."            
        ele punta "Ma non era finita qui."
        leo domanda "Quindi, cosa avveniva dopo?"

        show bg bolo
        with dissolve 

        ele parla "Si preparava il bolo, un'argilla che contiene ossido di ferro e conferisce un colore rosso."
        ele punta  "Addizio*nata alla chiara d'uovo, preparava la tavola o la tela all'applicazione della foglia d'oro."

        leo sorpreso "Il colore rosso, che si intravedeva sul fondo, conferiva \“calore”\ all'oro creando effetti chiaroscurali suggestivi!"
        leo punta "Siamo arrivati al momento clou! L'applicazione della delicatissima foglia al supporto!"

        ele domanda "Qual è la caratteristica più importante di questa fase?"

        show bg foglia
        with dissolve 

        leo punta "Mano ferma e grande accortezza! Erano i requisiti fondamentali per applicare le lamine d'oro!"

        ele parla "L'artigiano usava un coltello da doratore per applicare la foglia al supporto."

        leo parla "Poi con un pennello procedeva al tamponamento del pezzo per far aderire bene il tutto."

        ele domanda "Finito così?"

        leo punta "Assolutamente no! Siamo arrivati alla fase della levigatura!"

        ele domanda "Cioè?"

        show bg levigatura
        with dissolve

        leo parla "Ora che la foglia era applicata, bisognava brunire, cioè lucidare l'oro."
        leo punta "Per farlo si usava il brunitoio - fatto con osso o pietra d'agata – e si strofinava la superficie finché non diventava lucida."

        ele sorpresa "ora arriva la parte che preferisco!"

        leo domanda "Quale?"

        ele segreto "La punzonatura! Te la spiego:"


        show bg finitura:
            subpixel True ypos 1.0 zoom 1.0 



        ele parla "Il punzone era uno strumento che imprimeva un segno o una forma sulla superficie, impreziosendo il tutto."
        ele "Con la punzonatura si creavano effetti materici e tridimensionali. Si decoravano le aureole dei Santi, gli sfondi e si rifinavano i piccoli dettagli."
        
        leo sorpreso "Ah che meraviglia!"

        ele sorpresa "Davvero strepitoso. E così siamo giunti all'ultimo step. La velatura!"

        show bg velatura:
            subpixel True pos (0.54, 1.53) zoom 2.26 
        with dissolve 

        ele parla "La velatura era la pennellata  di uno strato di colore finale, sul lavoro fatto."

        leo parla "Veniva applicata per spegnere un po'l'effetto lucido della brunitura e proteggere la doratura dal deterioramento."

        ele sorride "Il nostro viaggio nel mondo della doratura è giunto al termine!"





        ## End of this section 
        jump backtocontentmenu

    #########################################
    ## Brings back to content menu ##########
    #########################################

    label backtocontentmenu:

    scene bg bottega:
        subpixel True pos (0.0, -0.04) zoom 1.54 

    show riccardo ascolta onlayer rightmostcharacter:
            xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

    show maira onlayer leftmostcharacter:
            xpos maira_xpos ypos maira_ypos zoom maira_zoom

    jump content

    ############################################
    ## SECTION: Greetings ######################
    ############################################

    label congedo:

        show riccardo saluta onlayer rightmostcharacter:
            xpos riccardo_xpos ypos riccardo_ypos zoom riccardo_zoom

        show maira saluta onlayer leftmostcharacter:
            xpos maira_xpos ypos maira_ypos zoom maira_zoom

        ric "Grazie per aver visitato la Bottega del Dipintore!"

        mar "Arrivederci a presto!"

        return


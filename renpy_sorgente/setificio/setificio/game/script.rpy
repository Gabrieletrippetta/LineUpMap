
### PERSONAGGI

#  Per prima cosa devi associare il nome di una famiglia di immagini al personaggio. Quando scrivi "e" Ren'py andrà a cercare tra le foto il cui nome comincia con "elena".
define luigi = Character("Luigi", color="#f44", image="luigi")
define mario = Character("Mario", color="#09e840", image="mario")
# Menu 
define menur = Character("Luigi", color="#09e840", image="menu")

### IMMAGINI
## Luigi
image luigi = "luigi.png"
image luigi ascolta = "luigi ascolta.png"
image luigi saluta = "luigi.png" # TO DO: CAMBIARE IMMAGINE
## Mario
image mario = "mario.png"
image mario ascolta = "mario ascolta.png"
image mario saluta = "mario.png" # TO DO: CAMBIARE IMMAGINE

## THUMBNAILS
## Luigi
image side luigi parla = "side_luigi.png"
image side luigi domanda = "side_luigi_domanda.png"
image side luigi sorpreso = "side_luigi_sorpreso.png"
image side luigi sorride = "side_luigi_sorride.png"
image side luigi segreto = "side_luigi_segreto.png"
image side luigi punta = "side_luigi_punta.png"

## Mario
image side mario parla ="side_mario.png"
image side mario sorpreso ="side_mario_sorpreso.png"
image side mario domanda ="side_mario_domanda.png"
image side mario sorride ="side_mario_sorride.png"

## CONSTANTS
## Left character
define luigi_xpos = -0.1
define luigi_ypos = 0.1
define luigi_zoom = 0.50
## Right character
define mario_xpos = 0.0
define mario_ypos = 0.05
define mario_zoom = 0.51


label start:

    #########################################
    ## SECTION: Intro              ##########
    #########################################
    
    
    show bg setificio:
        subpixel True ypos -306 zoom 1.5 



    # Mario is the rightmost character
    show mario onlayer rightmostcharacter:
        xpos mario_xpos ypos mario_ypos zoom mario_zoom

    # Elena is the leftmost character
    show luigi ascolta onlayer leftmostcharacter:
        xpos luigi_xpos ypos luigi_ypos zoom luigi_zoom

    show mario ascolta onlayer rightmostcharacter:
        xpos mario_xpos ypos mario_ypos zoom mario_zoom

    show luigi onlayer leftmostcharacter:
        xpos luigi_xpos ypos luigi_ypos zoom luigi_zoom

    luigi "C'era un tempo in cui, qui a Bevagna, alle vigne e agli ulivi si alternavano distese di Gelsi. "

    mario "Per via dei suoi dolci frutti?"

    luigi "Non proprio... A Bevagna i gelsi servivano ad  altro. Scopriamolo insieme!"

    #########################################
    ## SECTION: Menu               ##########
    #########################################

    menu content:

        menur "Cosa vuoi sapere?"

        "Bachicoltura":
            hide luigi onlayer leftmostcharacter
            hide mario onlayer rightmostcharacter
            jump bachicoltura
        
        "Gelso":
            hide luigi onlayer leftmostcharacter
            hide mario onlayer rightmostcharacter
            jump gelso 

        "Storia":
            hide luigi onlayer leftmostcharacter
            hide mario onlayer rightmostcharacter
            jump storia 

        "Ok, grazie. Non ho altre curiosità.":
            hide luigi onlayer leftmostcharacter
            hide mario onlayer rightmostcharacter
            jump congedo


    #########################################
    ## SECTION: Bachicoltura   ##########
    #########################################

    label bachicoltura:

    #########################################
    ## SECTION: Scena 1  ##########
    #########################################
    
    show bg albero 

    luigi parla "Il gelso serviva alla bachicoltura, l'allevamento del baco per produrre la seta."

    #########################################
    ## SECTION: Scena 2  ##########
    #########################################
    
    show bg baco:
        subpixel True ypos -198 zoom 0.3 

    luigi "Il Bombyx Mori, cioè il baco, era allevato sulle foglie di gelso bianco, delle quali si nutriva."

    mario parla "Nel ciclo di vita del baco, andavano rispettati tanti criteri per ogni fase. Vediamoli insieme!"

    #########################################
    ## SECTION: Scena 3  ##########
    #########################################
    
    show bg setificio:
        subpixel True ypos -306 zoom 1.5  

    luigi punta "Passo dopo passo, vediamo come funzionava la bachicoltura a Bevagna!"

    mario domanda "Si parte con le uova. Cosa serviva?"
    
    show bg foglie:
        subpixel True pos (-144, -252) zoom 0.26 

    luigi "Il calore prima di tutto! Le uova per schiudersi avevano bisogno di temperature tra i 22 e i 24 C°."

    mario parla "Al bisogno esistevano metodi alternativi, come il calore del seno delle donne."

    #########################################
    ## SECTION: Scena 4  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario domanda "Bene, il calore è servito! Le uova sono schiuse. Cosa succede ora?"
    
    show bg cibo:
        subpixel True pos (-54, -306) xzoom 1.0 zoom 1.73 

    luigi parla "Alla schiusa delle uova, i nuovi nati andavano nutriti con le foglie di gelso tritate."
    

    #########################################
    ## SECTION: Scena 5  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5  

    mario parla "Questa è la parte più carina... I nuovi bacolini andavano messi a dimora..."

    show bg letto:
        subpixel True ypos -315 zoom 0.41 

    luigi "I bachi venivano riposti su telai o lettini. \nIn questi alloggiamenti crescevano mangiando le foglie di gelso."

    #########################################
    ## SECTION: Scena 6  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5  

    luigi punta "Ed ora siamo alla fase più importante! La formazione del bozzolo."

    mario sorride "È dal bozzolo che si produceva il filo di seta."
    
    show bg palla:
        subpixel True pos (-36, -369) zoom 0.61 

    mario parla "Quando il baco raggiungeva la maturità, iniziava a produrre il bozzolo con la sua bava."
    
    show bg filo:
        subpixel True pos (-36, -675) yzoom 1.0 zoom 1.05 

    mario "Il filo di un bozzolo prodotto in soli 3-4 giorni, raggiungeva centinaia di metri di lunghezza."

    #########################################
    ## SECTION: Scena 7  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi domanda "E poi cosa succedeva?"

    show bg morte:
        subpixel True ypos -225 zoom 1.52 

    mario "I bozzoli raccolti venivano messi ad essiccare al sole."

    mario sorride "Questa procedura portava alla morte della crisalide."

    luigi punta "In questo modo si evitava che la farfalla bucasse il bozzolo per uscire."

    #########################################
    ## SECTION: Scena 8  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi parla "Bene, ora da questi bozzoli dobbiamo tirare fuori la seta!"

    mario "Sì, questa operazione era chiamata “trattura”, vediamola insieme!"
    
    show bg bolle:
        subpixel True zoom 1.52 

    mario parla "Con la trattura si entrava nel vivo della produzione dei fili."

    luigi sorride "Consisteva nell'immersione dei bozzoli in acqua molto calda."

    mario "Questa procedura serviva a togliere la sostanza gommosa (sericina) che tiene uniti i vari filamenti."

    #########################################
    ## SECTION: Scena 9  ##########
    ######################################### 

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi domanda "Bene siamo giunti fin qui, non perdiamo il “filo” del discorso ora.."

    mario domanda "Parliamo di numeri allora."
    
    show bg vermi:
        subpixel True ypos -270 zoom 0.26 

    mario parla "Ogni baco da seta mangia solo 20-30 grammi di foglie di gelso nell'arco della sua vita."

    luigi punta "L'albero di gelso produce 2000-3000 kg in un anno."

    mario "Ed ora... Chiudiamo in bellezza..."

    #########################################
    ## SECTION: Scena 10  ##########
    #########################################  
    
    show bg seta:
        subpixel True pos (0, -1071) zoom 2.26 

    luigi domanda "Sapevi che un bozzolo di baco da seta, è costituito da un filo continuo che può raggiungere anche 900 metri?"

    mario domanda "Strabiliante vero?"




    ## End of this section 
    jump backtocontentmenu

    #########################################
    ## SECTION: Gelso      ##########
    #########################################

    label gelso:

    #########################################
    ## SECTION: Scena 1  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario parla "Il gelso era una grande risorsa nel medioevo, sia per l'allevamento dei bachi da seta, sia per i suoi succosi frutti."

    luigi parla "Andiamo alla scoperta di questo prodigioso albero!"
    
    show bg mora:
        subpixel True zoom 0.37 

    mario "Il Morus Alba o Gelso bianco, viene dalla famiglia delle Moracee."

    luigi "Originario dell'Estremo Oriente, fu introdotto nel Mediterraneo nel XII secolo."

    mario "I suoi frutti, le more bianche o nere, sono dolci e mangerecce."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario domanda "Vogliamo dire poi da dove deriva il suo nome?"

    luigi punta "Lo spiego subito!"

    #########################################
    ## SECTION: Scena 2  ##########
    #########################################
    



    show bg frutta:
        subpixel True ypos -45 zoom 0.34 


    luigi parla "Morus deriva dal latino morus e dal greco móron."

    luigi "Questo nome popolare derivava dal colore nero dei suoi frutti, le more. "

    luigi punta "Con questo nome si diffuse anche in area germanica e celtica."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario sorride "Interessante! Ma ancora più intrigante è il suo significato. Sai nel medioevo ogni cosa aveva un suo simbolismo!"

    luigi sorride "Bene, scopriamo il suo significato!"

    #########################################
    ## SECTION: Scena 3  ##########
    #########################################


    show bg sapienza:
        subpixel True ypos -54 zoom 2.27 


    mario sorride "Plinio lo chiamava, Albero Sapientissimo, perché era l'ultimo a sbocciare e il primo a maturare i frutti. Nell'Araldica medievale era simbolo di “prudenza”."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi punta "Inoltre un albero così importante era ovviamente al centro di molte storie e leggende."

    mario domanda "Ce le racconti?"

    #########################################
    ## SECTION: Scena 4  ##########
    #########################################
    
    show bg cinese:
        subpixel True ypos -99 



    mario sorride "La più conosciuta delle leggende sul gelso è quella della principessa cinese che scoprì la seta."



    show bg marco:
        subpixel True pos (-99, -720) xzoom 1.0 zoom 3.16 


    luigi sorpreso "Nella storia abbiamo Marco Polo,il primo europeo a descrivere l'albero di gelso e il suo utilizzo nella bachicoltura!"

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario domanda "Sapevi che gli utilizzi di questa pianta erano davvero i più disparati?"

    luigi domanda "Ad esempio?"

    #########################################
    ## SECTION: Scena 5  ##########
    #########################################
    


    show bg marmellata:
        subpixel True pos (-27, -54) zoom 0.41 




    mario sorride "Ad esempio con le more, dolci e succose, del gelso si preparavano conserve, confetture e distillati."


    show bg vite:
        subpixel True pos (0.0, -0.85) zoom 0.5 



    luigi parla "I gelsi servivano anche a sorreggere i filari della vite. Queste consociazioni si chiamavano “Vite Maritata”."
    

    show bg flore:
        subpixel True pos (-0.01, -0.13) zoom 1.52 



    mario parla "Bevagna era ricca di alberi di gelso, il cui utilizzo era molto variegato."

    luigi punta "Simbolo di sapienza, i suoi fiorellini bianchi sbocciano tra aprile e maggio."





    ## End of this section 
    jump backtocontentmenu


    #########################################
    ## SECTION: Storia   ##########
    #########################################

    label storia :

    #########################################
    ## SECTION: Scena 1  ##########
    #########################################

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario sorride "La storia della seta nasce migliaia di anni fa nell'Asia Orientale."

    luigi punta "Ripassiamo un po' la storia!"
    

    show bg principessa:
        subpixel True pos (-0.01, -1143) zoom 1.16 


    mario parla "Cina, 3000 a.C. L'imperatrice Xi Ling Shi, trova un bozzolo di un baco da seta nel tè che stava bevendo sotto a un gelso."
    

    show bg tee:
        subpixel True pos (0.0, -54) zoom 1.52 


    luigi sorpreso "Grazie al calore della bevanda l'imperatrice riuscì a tirare fuori un filo lunghissimo. Il primo filo di seta della storia! Nasce la leggenda."
    

    show bg storia:
        subpixel True pos (-0.01, -90) zoom 0.96 


    mario parla "Oltre al mito però, c'è la storia. I Cinesi furono effettivamente i primi a produrre e commerciare la seta per millenni. Il più antico reperto serico risale a ben 5.500 anni fa!"

    show bg marco:
        subpixel True pos (-99, -720) xzoom 1.0 zoom 3.16 

    luigi parla "Il giovane scopritore veneziano, Marco Polo, passò quasi 25 anni in Cina. Nel suo libro Il Milione, ci parla della produzione della seta,come di un'arte molto antica."

    mario sorride "Ma ciò che stupì davvero il veneziano, fu la carta moneta. Una banconota di seta, che ci descrive nel libro. Per produrla utilizzavano la corteccia del gelso."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario domanda "Quindi dalla Cina al resto del mondo..."

    luigi sorride "In un batter d'occhio!"

    #########################################
    ## SECTION: Scena 2  ##########
    #########################################


    show bg esercito:
        subpixel True pos (0.0, -54) zoom 1.01 

    mario parla "Il segreto di un'arte custodita per millenni, finisce con la dinastia Han."

    luigi punta "Il furto fu messo a segno dai Bizantini nel 500 d.C. Come? Importando i bachi da seta e i semi di gelso."
    

    show bg kimono:
        subpixel True pos (0.0, -54) zoom 1.51 


    mario sorride "La seta arriva dalla Cina anche in Giappone dove si svilupparono tecniche raffinatissime."

    luigi sorpreso "La seta giapponese è arrivata ad essere la più pregiata e costosa al mondo!"

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    mario sorride "E siamo arrivati al Medioevo..."

    luigi sorride "Tardi, però... “meglio tardi che mai”!"

    #########################################
    ## SECTION: Scena 3  ##########
    #########################################
    

    show bg italia:
        subpixel True ypos -315 zoom 1.52 


    mario parla "Dobbiamo attendere il XIII secolo per vedere la seta in Italia!"

    luigi parla "Il primo approdo è in Sicilia, con l'espansione del mondo islamico."

    mario sorride "Da quel momento l'Italia diventa il centro europeo più importante nella produzione della seta."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi punta "E da lì non ci siamo più fermati!"

    mario sorride "Ancora di più! Siamo diventati i primi produttori di seta!"

    #########################################
    ## SECTION: Scena 4  ##########
    #########################################
    

    show bg industria:
        subpixel True ypos -18 zoom 1.52 

    mario sorride "La seta ha avuto un ruolo cruciale nello sviluppo economico italiano."

    luigi parla "Fino al XIX secolo l'Italia era il primo produttore di seta greggia, insieme a Cina e Giappone."



    show bg bevagna:
        subpixel True pos (0.01, -36) zoom 0.5 




    mario sorride "In Umbria la gelsobachicoltura era diffusa  soprattutto nella zona di Bevagna, dove il Bombyx mori, cioè il bruco o baco da seta, veniva nutrito con foglie di gelso tritate finemente."

    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    luigi punta "Ma il glorioso periodo finirà con la modernità."

    mario domanda "Che peccato! Per quale motivo?"

    #########################################
    ## SECTION: Scena 5  ##########
    #########################################
    
    show bg macchina:
        subpixel True zoom 1.03 

    luigi parla "La bachicoltura inizia a scomparire tra le due guerre, soprattutto dopo il secondo conflitto."

    luigi "Le cause furono l'inurbamento e l'industrializzazione. Ma soprattutto l'avvento delle fibre sintetiche."




    ## End of this section 
    jump backtocontentmenu




    #########################################
    ## SECTION: Trailer   ##########
    #########################################

    label trailer :

    #########################################
    ## SECTION: Scena 1  ##########
    #########################################

    

    #########################################
    ## SECTION: Scena 2  ##########
    #########################################



    #########################################
    ## SECTION: Scena 3  ##########
    #########################################



    #########################################
    ## SECTION: Scena 4  ##########
    #########################################



    #########################################
    ## SECTION: Scena 5  ##########
    #########################################






    ## End of this section 
    jump backtocontentmenu






    #########################################
    ## Brings back to content menu ##########
    #########################################

    label backtocontentmenu:
        
    show bg setificio:
        subpixel True ypos -306 zoom 1.5 

    show mario ascolta onlayer rightmostcharacter:
        xpos mario_xpos ypos mario_ypos zoom mario_zoom

    show luigi onlayer leftmostcharacter:
        xpos luigi_xpos ypos luigi_ypos zoom luigi_zoom

    jump content

    ############################################
    ## SECTION: Greetings ######################
    ############################################

    label congedo:

        show mario saluta onlayer rightmostcharacter:
            xpos mario_xpos ypos mario_ypos zoom mario_zoom

        show luigi saluta onlayer leftmostcharacter:
            xpos luigi_xpos ypos luigi_ypos zoom luigi_zoom

        mario "Grazie per aver visitato il Setificio!"

        luigi "Arrivederci a presto!"

        return


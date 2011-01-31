class HousesController < ApplicationController
  layout 'common'
    
  # GET /houses
  # GET /houses.xml
  def index
    @map = GMap.new("map_div")
    @map.control_init(:map_type => true, :large_map => true,:overview_map=>true)
    @map.center_zoom_init([30.7645,120.7248],15)
        
    #icon init
    #        house = GIcon.new(:image=>'images/house.png',:iconAnchor=>GPoint.new(25,40),:iconSize=>GSize.new(52,52))
    #        hotel = GIcon.new(:image=>'images/hotel.png',:iconAnchor=>GPoint.new(25,40),:iconSize=>GSize.new(52,52))
    #        mall = GIcon.new(:image=>'images/mall.png',:iconAnchor=>GPoint.new(25,40),:iconSize=>GSize.new(52,52))
    #        @map.declare_global_init(house,'house')
    #        @map.declare_global_init(hotel,'hotel')
    #        @map.declare_global_init(mall,'mall')
    #        @map.icon_init()

    #添加自定义控件
    zoom_control_script = 'var zcontrol = new DragZoomControl();map.addControl(zcontrol);'
    @map.record_init(zoom_control_script)
    @map.record_init('map.addControl(new MyMapControl());')
        
    #@map.icon_init()

    ###############################################################
    @houses = House.find(:all)
        
    markers = []
    for h in @houses
      marker_id = 'house_'+h.id.to_s
      marker = GMarker.new([h.lng,h.lat], :title => h.title, :info_window => h.icon)
            
      #declare a house_xxx value for edit it later.
      @map.declare_global_init(marker,marker_id)
      new_marker = Variable.new(marker_id)
      markers << new_marker
      #@map.overlay_init(new_marker)
    end
                        
    ### marker manager ##################
    managed_markers = ManagedMarker.new(markers,10,17)
    mm = GMarkerManager.new(@map,:managed_markers => [managed_markers])
    @map.declare_init(mm,"mgr")
        
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @houses }
    end
  end

  # GET /houses/1
  # GET /houses/1.xml
  def show
    @house = House.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @house }
    end
  end

  # GET /houses/new
  # GET /houses/new.xml
  def new
    @map = GMap.new("map_div")
    @map.control_init(:large_map => true,:map_type => true)
    @map.center_zoom_init([30.7645,120.7248],15)
    @map.event_init(@map, :click, "function(marker, point) {
            if(marker == null)
            {
                map.clearOverlays();
                map.addOverlay( new GMarker(point,{title : ''}) );
                $('house_lng').value=point.y;
                $('house_lat').value=point.x;
            }
        }")
        
    @house = House.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @house }
    end
  end

  # GET /houses/1/edit
  def edit
    @house = House.find(params[:id])
    @map = GMap.new("map_div")
    @map.control_init(:large_map => true,:map_type => true)
        
    marker = GMarker.new([@house.lng,@house.lat], :title => @house.title, :info_window => @house.icon,:draggable=>true)
    @map.declare_global_init(marker,'marker')
    new_marker = Variable.new('marker')
    @map.overlay_init(new_marker)
    @map.center_zoom_init([@house.lng,@house.lat],15)
        
    @map.event_init(new_marker, :drag, "function(point) { $('house_lng').value=point.y; $('house_lat').value=point.x; }")
    @map.event_init(new_marker, :dragend, "function(point) {  $('house_lng').value=point.y; $('house_lat').value=point.x; }")
  end

  # POST /houses
  # POST /houses.xml
  def create
    @house = House.new(params[:house])

    respond_to do |format|
      if @house.save
        flash[:notice] = 'House was successfully created.'
        format.html { redirect_to(@house) }
        format.xml  { render :xml => @house, :status => :created, :location => @house }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @house.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /houses/1
  # PUT /houses/1.xml
  def update
    @house = House.find(params[:id])

    respond_to do |format|
      if @house.update_attributes(params[:house])
        flash[:notice] = 'House was successfully updated.'
        format.html { redirect_to(@house) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @house.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /houses/1
  # DELETE /houses/1.xml
  def destroy
    @house = House.find(params[:id])
    @house.destroy

    respond_to do |format|
      format.html { redirect_to(houses_url) }
      format.xml  { head :ok }
    end
  end
    
  def pan_to
    @map = GMap.new("map_div")
    house = House.find(params[:id],:select=>[:title])
        
    render :update do |page|
      page << @map.pan_to(GLatLng.new([params[:lng].to_f,params[:lat].to_f]))
      page << "house_#{params[:id]}.openInfoWindow('#{house.title}')"
    end
  end
    
  def clear_markers
    @map = GMap.new("map_div")
    render :update do |page|
      page << @map.clear_overlays
    end
  end
end

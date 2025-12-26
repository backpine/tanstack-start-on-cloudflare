import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  getCenterById,
  updateCenter,
  getStates,
} from "@/core/functions/center-functions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export const Route = createFileRoute("/centers/$centerId")({
  component: CenterEditPage,
  loader: async ({ params }) => {
    const center = await getCenterById({ data: { id: params.centerId } })
    return { center }
  },
})

type CenterFormData = {
  dialysisCenterName: string
  title: string
  sector: string
  description: string
  tel: string
  phoneNumber: string
  fax: string
  email: string
  website: string
  address: string
  addressWithUnit: string
  town: string
  stateId: string
  drInCharge: string
  drInChargeTel: string
  panelNephrologist: string
  centreManager: string
  centreCoordinator: string
  units: string
  hepatitisBay: string
  benefits: string
  featured: boolean
}

function CenterEditPage() {
  const { centerId } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const queryClient = useQueryClient()

  const { data: center, isLoading: centerLoading } = useQuery({
    queryKey: ["center", centerId],
    queryFn: () => getCenterById({ data: { id: centerId } }),
    initialData: loaderData.center,
  })

  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: () => getStates(),
  })

  const [formData, setFormData] = useState<CenterFormData>({
    dialysisCenterName: "",
    title: "",
    sector: "",
    description: "",
    tel: "",
    phoneNumber: "",
    fax: "",
    email: "",
    website: "",
    address: "",
    addressWithUnit: "",
    town: "",
    stateId: "",
    drInCharge: "",
    drInChargeTel: "",
    panelNephrologist: "",
    centreManager: "",
    centreCoordinator: "",
    units: "",
    hepatitisBay: "",
    benefits: "",
    featured: false,
  })

  useEffect(() => {
    if (center) {
      setFormData({
        dialysisCenterName: center.dialysisCenterName ?? "",
        title: center.title ?? "",
        sector: center.sector ?? "",
        description: center.description ?? "",
        tel: center.tel ?? "",
        phoneNumber: center.phoneNumber ?? "",
        fax: center.fax ?? "",
        email: center.email ?? "",
        website: center.website ?? "",
        address: center.address ?? "",
        addressWithUnit: center.addressWithUnit ?? "",
        town: center.town ?? "",
        stateId: center.stateId ?? "",
        drInCharge: center.drInCharge ?? "",
        drInChargeTel: center.drInChargeTel ?? "",
        panelNephrologist: center.panelNephrologist ?? "",
        centreManager: center.centreManager ?? "",
        centreCoordinator: center.centreCoordinator ?? "",
        units: center.units ?? "",
        hepatitisBay: center.hepatitisBay ?? "",
        benefits: center.benefits ?? "",
        featured: center.featured ?? false,
      })
    }
  }, [center])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CenterFormData>) =>
      updateCenter({ data: { id: centerId, data } }),
    onSuccess: () => {
      toast.success("Center updated successfully")
      queryClient.invalidateQueries({ queryKey: ["center", centerId] })
      queryClient.invalidateQueries({ queryKey: ["centers"] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update center")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (centerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Edit Center</h1>
          </div>
          <Button
            type="submit"
            form="center-form"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <form id="center-form" onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General details about the dialysis center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="dialysisCenterName">
                    Center Name
                  </FieldLabel>
                  <Input
                    id="dialysisCenterName"
                    name="dialysisCenterName"
                    value={formData.dialysisCenterName}
                    onChange={handleInputChange}
                    placeholder="Enter center name"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="sector">Sector</FieldLabel>
                    <Input
                      id="sector"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      placeholder="e.g., Private, Government"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter center description"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Phone, email, and website details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="tel">Telephone</FieldLabel>
                    <Input
                      id="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleInputChange}
                      placeholder="Enter telephone"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="fax">Fax</FieldLabel>
                    <Input
                      id="fax"
                      name="fax"
                      value={formData.fax}
                      onChange={handleInputChange}
                      placeholder="Enter fax number"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="website">Website</FieldLabel>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Address and location details</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={2}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="addressWithUnit">
                    Address with Unit
                  </FieldLabel>
                  <Input
                    id="addressWithUnit"
                    name="addressWithUnit"
                    value={formData.addressWithUnit}
                    onChange={handleInputChange}
                    placeholder="Enter address with unit number"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="town">Town</FieldLabel>
                    <Input
                      id="town"
                      name="town"
                      value={formData.town}
                      onChange={handleInputChange}
                      placeholder="Enter town"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stateId">State</FieldLabel>
                    <Select
                      value={formData.stateId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, stateId: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states?.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Information</CardTitle>
              <CardDescription>
                Key personnel at the dialysis center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="drInCharge">
                      Doctor In Charge
                    </FieldLabel>
                    <Input
                      id="drInCharge"
                      name="drInCharge"
                      value={formData.drInCharge}
                      onChange={handleInputChange}
                      placeholder="Enter doctor name"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="drInChargeTel">
                      Doctor Phone
                    </FieldLabel>
                    <Input
                      id="drInChargeTel"
                      name="drInChargeTel"
                      value={formData.drInChargeTel}
                      onChange={handleInputChange}
                      placeholder="Enter doctor phone"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="panelNephrologist">
                    Panel Nephrologist
                  </FieldLabel>
                  <Input
                    id="panelNephrologist"
                    name="panelNephrologist"
                    value={formData.panelNephrologist}
                    onChange={handleInputChange}
                    placeholder="Enter nephrologist name"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="centreManager">
                      Centre Manager
                    </FieldLabel>
                    <Input
                      id="centreManager"
                      name="centreManager"
                      value={formData.centreManager}
                      onChange={handleInputChange}
                      placeholder="Enter manager name"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="centreCoordinator">
                      Centre Coordinator
                    </FieldLabel>
                    <Input
                      id="centreCoordinator"
                      name="centreCoordinator"
                      value={formData.centreCoordinator}
                      onChange={handleInputChange}
                      placeholder="Enter coordinator name"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>
                Equipment and services available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="units">Units</FieldLabel>
                    <Input
                      id="units"
                      name="units"
                      value={formData.units}
                      onChange={handleInputChange}
                      placeholder="Number of units"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="hepatitisBay">
                      Hepatitis Bay
                    </FieldLabel>
                    <Input
                      id="hepatitisBay"
                      name="hepatitisBay"
                      value={formData.hepatitisBay}
                      onChange={handleInputChange}
                      placeholder="Enter hepatitis bay info"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="benefits">Benefits</FieldLabel>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="Enter benefits and services offered"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Control how this center appears on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field orientation="horizontal">
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured Center</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Featured centers are highlighted on the homepage
                </p>
              </Field>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

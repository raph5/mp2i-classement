import { Modal, ModalBody, ModalContent, ModalHeader, type ModalProps } from "@nextui-org/react";
import type React from "react";
import { omit } from "../../utils";

export interface RankingModalProps extends ModalProps {
  header: string
  children: React.ReactNode
}

const RankingModal: React.FC<RankingModalProps> = (props) => {
  const { header, children } = props
  const modalProps = omit(props, ['header', 'children'])
  
  return (
    <Modal {...modalProps}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 capitalize">{header}</ModalHeader>
        <ModalBody className="h-24 overflow-y-auto">
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default RankingModal;